import config from '../config';
import QRCode from 'qrcode';

function downloadExcel(fileName, base64String) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.style = "visibility:hidden;";
      link.download = fileName;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}

async function getExcel(groupId, examId, buttonId) {
    const excelButton = document.getElementById(buttonId);
    excelButton.innerText = 'Downloading...';
    if (examId) {
        // For a single exam:
        const response = await fetch(`${config.backend}/exams/${groupId}/${examId}/excel`, {
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
        downloadExcel(data.fileName, data.buffer);
        excelButton.innerText = 'Download Entries Excel';
    } else {
        // For an exam group:
        const response = await fetch(`${config.backend}/exam-groups/${groupId}/excel`, {
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
        downloadExcel(data.result.fileName, data.result.buffer);
        excelButton.innerText = 'Download Entries Excel';
    }
}

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
    getExcel,
    getPassword,
    createQR,
};