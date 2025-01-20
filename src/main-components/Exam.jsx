import { useEffect, useState } from "react";
import config from '../config';
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../javascript/dateConverter";
import NotFound from "./NotFound";
import Navbar from "../partial-components/Navbar";
import { createQR, getPassword } from "../javascript/examAccess";

function Exam() {
    const { groupId, examId } = useParams();

    const [exam, setExam] = useState([]);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    const passwordDivId = "passwordcode";
    const passwordButtonId = "passwordbutton";
    const qrDivId = "qrcode";
    const qrButtonId = "qrbutton";

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
                console.log(errorData.error)
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

    useEffect(() => {
        loadExam();
    }, []);

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
                    <div>
                        <h1>{exam.title}</h1>
                        <h2>{exam.desciption}</h2>
                        <h3>{formatDate(exam.startTime)} - {formatDate(exam.endTime)}</h3>

                        { exam.isEditor ? (
                            <>
                                <div>
                                    <Link to="#">Download Entries Excel</Link>
                                    <button id={passwordButtonId} onClick={() => getPassword(groupId, examId, passwordDivId, passwordButtonId)}>Show Password</button>
                                    <button id={qrButtonId} onClick={() => createQR(groupId, examId, qrDivId, qrButtonId)}>Show QR Code</button>
                                </div>
                                <div>
                                    <div id={passwordDivId}></div>
                                    <div id={qrDivId}></div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <Link to="#">Sign</Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Exam;