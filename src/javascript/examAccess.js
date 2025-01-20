import config from '../config';
import QRCode from 'qrcode';

async function getPassword(groupId, examId, divId, buttonId) {
    const passwordButton = document.getElementById(buttonId);
    const passwordDiv = document.getElementById(divId);

    if (passwordDiv.innerHTML) {
        passwordDiv.innerHTML = '';
        passwordButton.innerText = 'Show Password';
        return;
    }

    const response = await fetch(`${config.backend}/exams/${groupId}/${examId}/password`, {
        method: 'GET',
        headers: {
            'authorization': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken'),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        const p = document.createElement('p');
        p.innerText = errorData.error;
        return;
    }

    const data = await response.json();

    const p = document.createElement('p');
    p.innerText = data.password;
    passwordDiv.appendChild(p);
    passwordButton.innerText = 'Hide Password';

}

async function createQR(groupId, examId, divId, buttonId) {
    const qrButton = document.getElementById(buttonId);
    const qrDiv = document.getElementById(divId);

    if (qrDiv.innerHTML) {
        qrDiv.innerHTML = '';
        qrButton.innerText = 'Show QR Code';
        return;
    }

    const response = await fetch(`${config.backend}/exams/${groupId}/${examId}/password`, {
        method: 'GET',
        headers: {
            'authorization': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken'),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        const p = document.createElement('p');
        p.innerText = errorData.error;
        return;
    }

    const data = await response.json();

    QRCode.toCanvas(`${config.frontend}/exam-group/${groupId}/exam/${examId}?password=${data.password}`, { width: 200 }, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        qrDiv.appendChild(canvas); // Add the generated QR code to the page
        qrButton.innerText = 'Hide QR Code';
      });
}

export {
    getPassword,
    createQR,
};