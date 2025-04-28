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
    const table = doc.querySelector('table.table.table-bordered');
    let name = '-';
    let applicationId = '-';

    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const th = row.querySelector('th');
            const td = row.querySelector('td');
            if (th && td) {
                const heading = th.textContent.trim().toLowerCase();
                const value = td.textContent.trim();
                if (heading.includes('candidate name')) {
                    name = value;
                } else if (heading.includes('application id')) {
                    applicationId = value;
                }
            }
        });
    }

    document.getElementById('student-name').textContent = name;
    document.getElementById('application-id').textContent = applicationId;

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
