import { useEffect, useState } from "react";
import config from '../config';
import { useLocation, useParams } from "react-router-dom";
import { formatDate } from "../javascript/dateConverter";
import NotFound from "./NotFound";
import Navbar from "../partial-components/Navbar";
import { createQR, getExcel, getPassword } from "../javascript/examAccess";
import '../css/cards.css';

function Exam() {
    const { groupId, examId } = useParams();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const password = queryParams.get('password');

    const [exam, setExam] = useState([]);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state
    const [currentDate, setCurrentDate] = useState(new Date()); // Store current date for status check

    const excelButtonId = "excelbutton";
    const passwordDivId = "passwordcode";
    const passwordButtonId = "passwordbutton";
    const qrDivId = "qrcode";
    const qrButtonId = "qrbutton";
    const signButtonId = "signbutton";
    const signErrorId = "signerror";

    // Update current date every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // This makes sure the date is refreshed every second

        return () => clearInterval(interval);  // Cleanup the interval on unmount
    }, []);

    const loadExam = async () => {
        setError('');
        setIsLoaded(false); // Reset loaded state before fetching

        try {
            const response = await fetch(`${config.backend}/exams/${groupId}/${examId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load exam. Please try again.');
                console.error(errorData.error)
                window.location.href = '/';
                return;
            }

            const data = await response.json();
            setExam(data);
            setIsLoaded(true); // Mark as successfully loaded
        } catch (err) {
            setError('An error occurred. Please try again.');
            window.location.href = '/'; // Redirect on error
        }
    };

    const sign = async () => {
        try {
            const signButton = document.getElementById(signButtonId);
            const errorP = document.getElementById(signErrorId);

            const response = await fetch(`${config.backend}/entries/sign/${examId}?password=${document.getElementById('password').value}`, {
                method: 'POST',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                errorP.innerText = errorData.error;
                return;
            }

            signButton.disabled = true;
            errorP.innerText = 'Success!';
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        loadExam();
    }, []);

    const isExamOpen = currentDate >= new Date(exam.startTime) && currentDate <= new Date(exam.endTime);

    if (!isLoaded) {
        return <h2>Loading...</h2>; // Render a loading state
    }

    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Navbar />
                    <div className="cards-container dir-column">
                        <div className="card no-hover">
                            <p className="title">{exam.title}</p>
                            <p className="description">{exam.description}</p>
                            <p className="date">{formatDate(exam.startTime)} - {formatDate(exam.endTime)}</p>
                            <p className={`status ${isExamOpen ? 'active' : null}`}>Status: {isExamOpen ? 'OPEN' : 'CLOSED'}</p>
                        </div>
                    </div>
                        {exam.isEditor ? (
                            <>
                                <div className="centered">
                                    <button className="action" id={excelButtonId} onClick={() => getExcel(groupId, examId, excelButtonId)}>Download Entries Excel</button>
                                    <button className="action" id={passwordButtonId} onClick={() => getPassword(groupId, examId, passwordDivId, passwordButtonId)}>Show Password</button>
                                    <button className="action" id={qrButtonId} onClick={() => createQR(groupId, examId, qrDivId, qrButtonId)}>Show QR Code</button>
                                </div>
                                <div className="centered">
                                    <div id={passwordDivId}></div>
                                    <div id={qrDivId}></div>
                                </div>
                            </>
                        ) : (
                            <div className="centered">
                                <input type="text" id="password" value={password ? password : null} />
                                <button className="action" id={signButtonId} onClick={() => sign()}>Sign</button>
                                <p id={signErrorId}></p>
                            </div>
                        )}
                </>
            )}
        </>
    );
}

export default Exam;
