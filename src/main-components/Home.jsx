import { useEffect, useState } from "react";
import config from '../config';
import Navbar from "../partial-components/Navbar";
import ExamGroupCard from "../partial-components/ExamGroupCard";
import { Link } from "react-router-dom";
import '../css/cards.css';

function Home() {
    const [examGroups, setExamGroups] = useState([]);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    const loadExamGroups = async () => {
        setError('');
        setIsLoaded(false); // Reset loaded state before fetching

        try {
            const response = await fetch(`${config.backend}/exam-groups/`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load exam groups. Please try again.');
                window.location.href = '/login'; // Redirect if the fetch fails
                return;
            }

            const data = await response.json();
            setExamGroups(data);
            setIsLoaded(true); // Mark as successfully loaded
        } catch (err) {
            setError('An error occurred. Please try again.');
            window.location.href = '/login'; // Redirect on error
        }
    };

    useEffect(() => {
        loadExamGroups();
    }, []);

    if (!isLoaded) {
        return <h2>Loading...</h2>; // Render a loading state
    }

    return (
        <>
            <Navbar />
            { examGroups.isEditor && <Link className="action" to="/exam-group/new">Create an Exam Group</Link> }
            { localStorage.getItem("role") === "admin" && <Link className="action" to="/register">Create a new User</Link> }
            <div className="cards-container">
                {examGroups.data.map(({ examGroup }) => (
                    <ExamGroupCard key={examGroup.id} title={examGroup.title} description={examGroup.description} id={examGroup.id} />
                ))}
            </div>
        </>
    );
}

export default Home;
