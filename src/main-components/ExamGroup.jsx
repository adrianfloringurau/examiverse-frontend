import { useEffect, useState } from "react";
import config from '../config';
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Navbar from "../partial-components/Navbar";
import ExamCard from "../partial-components/ExamCard";

function ExamGroup() {
    const { groupId } = useParams();

    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    const loadExams = async () => {
        setError('');
        setIsLoaded(false); // Reset loaded state before fetching

        try {
            const response = await fetch(`${config.backend}/exams/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load exam groups. Please try again.');
                window.location.href = '/';
                return;
            }

            const data = await response.json();
            setExams(data);
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
                    <div>
                        {exams.map((exam) => (
                            <ExamCard
                                key={exam.id}
                                title={exam.title}
                                description={exam.description}
                                id={exam.id}
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