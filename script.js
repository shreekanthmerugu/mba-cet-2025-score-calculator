document.getElementById('file-upload').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const slot = document.getElementById('slot-selection').value;
    if (!slot) {
        alert('⚠️ Please select your Slot before uploading the file!');
        event.target.value = '';
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseHTML(htmlContent, slot);
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent, slot) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const span = doc.querySelector('span.hidden-sm.hidden-md');
    let applicationId = "-", name = "-";
    if (span) {
        const textContent = span.textContent.trim();
        [applicationId, name] = textContent.split(' - ').map(item => item.trim());
    }

    const rows = Array.from(doc.querySelectorAll('tbody tr'));
    const tbody = document.querySelector('#question-table tbody');
    tbody.innerHTML = '';

    let lr = 0, ar = 0, qa = 0, va = 0, totalCorrect = 0;
    const totalQuestions = 200;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const questionId = cells[0].innerText.trim();
            const subject = cells[1].innerText.trim();
            const optionsText = cells[2].innerText.trim();

            const correctOptionMatch = optionsText.match(/Correct Option:\s*(\d+)/);
            const candidateResponseMatch = optionsText.match(/Candidate Response:\s*(\d+)/);

            const correctOption = correctOptionMatch ? correctOptionMatch[1] : '-';
            const userOption = candidateResponseMatch ? candidateResponseMatch[1] : '-';

            const isCorrect = (correctOption === userOption) ? 'Yes' : 'No';

            if (isCorrect === 'Yes') {
                if (subject === "Logical Reasoning") lr++;
                else if (subject === "Abstract Reasoning") ar++;
                else if (subject === "Quantitative Aptitude") qa++;
                else if (subject === "Verbal Ability") va++;
                totalCorrect++;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${questionId}</td>
                <td>${subject}</td>
                <td>${correctOption}</td>
                <td>${userOption}</td>
                <td class="${isCorrect === 'Yes' ? 'is-correct-yes' : 'is-correct-no'}">${isCorrect}</td>
            `;
            tbody.appendChild(tr);
        }
    });

    const percentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);

    document.getElementById('name').textContent = name;
    document.getElementById('appId').textContent = applicationId;
    document.getElementById('total-marks').textContent = `${totalCorrect}/200`;
    document.getElementById('percentage').textContent = `${percentage}%`;

    // ➡️ After all parsing, open the Google Form
    openGoogleForm(name, applicationId, slot, totalCorrect);
}

function openGoogleForm(name, appId, slot, totalCorrect) {
    const formBaseURL = 'https://docs.google.com/forms/d/e/1FAIpQLScpO8PASb0aWR2cRwDn8NQEy8mHVR7D8hP3ddxHckxyLcLSUA/viewform?usp=pp_url';

    const params = new URLSearchParams({
        'entry.584554654': name,               // Name
        'entry.482467827': appId,               // Application ID
        'entry.718325637': slot,                // Slot
        'entry.316327773': `${totalCorrect}`    // Total Marks
    });

    const finalURL = `${formBaseURL}&${params.toString()}`;
    window.open(finalURL, '_blank');
}
