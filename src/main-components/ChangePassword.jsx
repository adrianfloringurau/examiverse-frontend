import { useState } from 'react';
import config from '../config';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (newPassword !== repeatedPassword) throw new Error("Passwords don't match!");

            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                throw new Error('Missing authentication tokens. Please log in.');
            }

            const response = await fetch(`${config.backend}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: accessToken,
                    'x-refresh-token': refreshToken,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password changed successfully!');
            } else {
                setError(data.error || 'Password change failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="full-container">
            <form className="centered-container shadow" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        placeholder="Old Password"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="New Password"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={repeatedPassword}
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        required
                        placeholder="Confirm New Password"
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit" disabled={!oldPassword || !newPassword || !repeatedPassword}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
