import { useState } from 'react';
import config from '../config';

function ExamGroupForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await fetch(`${config.backend}/exam-groups/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken'),
        },
        body: description ? JSON.stringify({ title, description }) :
        JSON.stringify({ title }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Group created!');
        // Optionally redirect the user
        window.location.href = '/';
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="full-container">
      <form className="centered-container shadow" onSubmit={handleSubmit}>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={!title}>Create Exam Group</button>
      </form>
    </div>
  );
}

export default ExamGroupForm;
