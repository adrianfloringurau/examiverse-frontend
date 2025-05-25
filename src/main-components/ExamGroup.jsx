import { useEffect, useState } from "react";
import config from '../config';
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Navbar from "../partial-components/Navbar";
import ExamCard from "../partial-components/ExamCard";
import { getExcel } from "../javascript/examAccess";
import '../css/cards.css';

function ExamGroup() {
    const { groupId } = useParams();

    const excelButtonId = "excelbutton";

    const [examGroup, setExamGroup] = useState({});
    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    const loadExams = async () => {
        setError('');
        setIsLoaded(false); // Reset loaded state before fetching

        try {
            const response1 = await fetch(`${config.backend}/exam-groups/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            const response2 = await fetch(`${config.backend}/exams/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            if (!response1.ok || !response2.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load exam group. Please try again.');
                window.location.href = '/';
                return;
            }

            const data1 = await response1.json();
            setExamGroup(data1);
            const data2 = await response2.json();
            setExams(data2);
            setIsLoaded(true); // Mark as successfully loaded
        } catch (err) {
            setError('An error occurred. Please try again.');
            window.location.href = '/'; // Redirect on error
        }
    };

    useEffect(() => {
        loadExams();
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
                    <div className="cards-container dir-column">
                        <div className="card fit-content no-hover">
                            <h2>{examGroup.result.data.title}</h2>
                            <p>{examGroup.result.data.description}</p>
                        </div>
                        { examGroup.result.isEditor && (
                        <div className="card fit-content no-hover">
                            <button className="action" id={excelButtonId} onClick={() => getExcel(groupId, null, excelButtonId)}>Download Entries Excel</button>
                            <Link className="action" to={`/exam-group/${groupId}/exam/new`}>Create an Exam</Link>
                        </div>
                    ) }
                    </div>
                    <div className="cards-container dir-column">
                        {exams.map((exam) => (
                            <ExamCard
                                key={exam.id}
                                title={exam.title}
                                description={exam.description}
                                id={exam.id}
                                groupId={exam.groupId}
                                startTime={exam.startTime}
                                endTime={exam.endTime}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
    
}

export default ExamGroup;