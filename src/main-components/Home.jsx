import { useEffect, useState } from "react";
import config from '../config';
import Navbar from "../partial-components/Navbar";
import Card from "../partial-components/Card";

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
            <div>
                {examGroups.map(({ examGroup }) => (
                    <Card key={examGroup.id} title={examGroup.title} description={examGroup.description} id={examGroup.id} />
                ))}
            </div>
        </>
    );
}

export default Home;
