import config from '../config';

export default async function logout() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
        try {
            const response = await fetch(`${config.backend}/users/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the header
                },
                body: JSON.stringify({ refreshToken }), // Include the refresh token in the request body
            });

            if (!response.ok) {
                const errorData = await response.json();
                const p = document.createElement('p');
                p.innerText = errorData.error;
                return;
            }

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            window.location.href = '/';
        } catch (err) {
            console.error(err);
            return;
        }
    }
}