import { useState, useEffect } from 'react';
import config from '../config';
import Forbidden from './Forbidden';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            setIsAdmin(false);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (password !== repeatedPassword) throw new Error("Passwords don't match!");

            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                throw new Error('Missing authentication tokens. Please log in.');
            }

            const response = await fetch(`${config.backend}/users/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: accessToken,
                    'x-refresh-token': refreshToken,
                },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User created successfully!');
                setUsername('');
                setPassword('');
                setRepeatedPassword('');
                setRole('');
            } else {
                setError(data.error || 'Register failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        }
    };

    if (!isAdmin) {
        return <Forbidden />;
    }

    return (
        <div className="full-container">
            <form className="centered-container shadow" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={repeatedPassword}
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        required
                        placeholder="Confirm Password"
                    />
                </div>
                <div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select Role
                        </option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit" disabled={!username || !password || !repeatedPassword || !role}>
                    Create new User
                </button>
            </form>
        </div>
    );
}

export default Register;