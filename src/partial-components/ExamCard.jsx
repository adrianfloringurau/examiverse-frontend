import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ExamCard(props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());  // Update currentDate every second
        }, 1000); // This makes sure the date is refreshed every second

        return () => clearInterval(interval);  // Cleanup the interval on unmount
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleString();  // Formats the date as a string (you can adjust format)
    };

    return (
        <div>
            <Link to={`/exam-group/${props.groupId}/exam/${props.id}`}>
                <h2>{props.title}</h2>
                <p>{props.description}</p>
                <p>Status: {currentDate >= new Date(props.startTime) && currentDate <= new Date(props.endTime) ? 'OPEN' : 'CLOSED'}</p>
                <p>Start time: {formatDate(props.startTime)}</p>
                <p>End time: {formatDate(props.endTime)}</p>
            </Link>
        </div>
    );
}

export default ExamCard;
