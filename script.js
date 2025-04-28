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

    // Fetch Name and Application ID
    const nameElement = doc.querySelector('div.col-12.text-center h5');
    const applicationIdElement = doc.querySelector('div.col-12.text-center p');

    if (nameElement && applicationIdElement) {
        document.getElementById('student-name').textContent = nameElement.textContent.trim();
        document.getElementById('application-id').textContent = applicationIdElement.textContent.trim().split(":")[1].trim();
    }

    // Fetch Question Table
    const rows = Array.from(doc.querySelectorAll('tbody tr'));

    let lr = 0, ar = 0, qa = 0, va = 0;
    let totalScore = 0;

    const tbody = document.querySelector('#question-table tbody');
    tbody.innerHTML = '';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const questionId = cells[0].innerText.trim();
            const subject = cells[1].innerText.trim();
            const correctOption = cells[2].innerText.trim();
            const userOption = cells[3].innerText.trim();
            const isCorrect = cells[4].innerText.trim();

            // Count subject-wise correct
            if (isCorrect.toLowerCase() === 'yes') {
                if (subject === 'Logical Reasoning') lr++;
                else if (subject === 'Abstract Reasoning') ar++;
                else if (subject === 'Quantitative Aptitude') qa++;
                else if (subject === 'Verbal Ability') va++;
            }

            // Count total score
            if (isCorrect.toLowerCase() === 'yes') totalScore++;

            // Add row to table
            const newRow = `
                <tr>
                    <td>${questionId}</td>
                    <td>${subject}</td>
                    <td>${correctOption}</td>
                    <td>${userOption}</td>
                    <td>${isCorrect}</td>
                </tr>
            `;
            tbody.innerHTML += newRow;
        }
    });

    const totalQuestions = 200;
    const totalMarks = 200;
    const percentage = ((totalScore / totalQuestions) * 100).toFixed(2) + '%';

    // Update Section Wise
    document.getElementById('lr-score').textContent = lr;
    document.getElementById('ar-score').textContent = ar;
    document.getElementById('qa-score').textContent = qa;
    document.getElementById('va-score').textContent = va;

    // Update Summary
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('total-marks').textContent = totalScore + '/200';
    document.getElementById('percentage').textContent = percentage;
}
