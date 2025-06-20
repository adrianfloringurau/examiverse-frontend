import { useState } from 'react';
import config from '../config';
import { useParams } from 'react-router-dom';

function ExamForm() {
    const { groupId } = useParams(); // Get groupId from URL params
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await fetch(`${config.backend}/exams/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken'),
                },
                body: description ? JSON.stringify({ title, description, startTime, endTime, groupId, password }) : JSON.stringify({ title, startTime, endTime, groupId, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Exam created successfully!');
                // Redirect or reset form
                window.history.length > 1 ? window.history.back() : window.location.href = '/';
            } else {
                setError(data.error || 'Failed to create the exam. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='full-container'>
            <form className='centered-container shadow' onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder='Title'
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Description'
                    />
                </div>
                <div>
                    <label>Start time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        placeholder='STart time'
                    />
                </div>
                <div>
                    <label>End time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Password'
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={!title || !startTime || !endTime || !password}>Create Exam</button>
            </form>
        </div>
    );
}

export default ExamForm;
