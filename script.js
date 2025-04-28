document.getElementById('file-upload').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseHTML(htmlContent);
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // ✅ Correctly fetch Name and Application ID
    const span = doc.querySelector('span.hidden-sm.hidden-md');
    if (span) {
        const textContent = span.textContent.trim();
        const [applicationId, name] = textContent.split(' - ').map(item => item.trim());
        document.getElementById('appId').textContent = applicationId || "-";
        document.getElementById('name').textContent = name || "-";
    } else {
        document.getElementById('appId').textContent = "-";
        document.getElementById('name').textContent = "-";
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

    document.getElementById('lr-score').innerText = `${lr}/75`;
    document.getElementById('ar-score').innerText = `${ar}/25`;
    document.getElementById('qa-score').innerText = `${qa}/50`;
    document.getElementById('va-score').innerText = `${va}/50`;

    document.getElementById('total-marks').innerText = `${totalCorrect}/200`;
    document.getElementById('percentage').innerText = `${percentage}%`;
}
