document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseResponseSheet(content);
    };
    reader.readAsText(file);
}

function parseResponseSheet(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Fetch Name and Application ID
    const navText = doc.querySelector('.navbar-nav .nav-link span.hidden-sm.hidden-md')?.textContent.trim();
    if (navText) {
        const [appId, ...nameParts] = navText.split(' - ');
        document.getElementById('student-name').textContent = nameParts.join(' - ');
        document.getElementById('application-id').textContent = appId;
    }

    document.getElementById('student-details').classList.remove('hidden');

    // Parse question details
    const rows = [...doc.querySelectorAll('#tblObjection tr')].slice(1); // skipping header

    let correctCount = 0;
    let logical = 0, abstract = 0, quant = 0, verbal = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 2) return; // skip if invalid

        const questionId = cells[0].textContent.trim();
        const section = cells[1].textContent.trim();
        const correctOption = cells[2].querySelector('table tr td b:contains("Correct Option:") ~ span')?.textContent.trim();
        const candidateResponse = cells[2].querySelector('table tr td b:contains("Candidate Response:") ~ span')?.textContent.trim();

        let isCorrect = false;
        if (correctOption && candidateResponse) {
            isCorrect = correctOption === candidateResponse;
            if (isCorrect) correctCount++;

            switch (section) {
                case 'Logical Reasoning':
                    logical += isCorrect ? 1 : 0;
                    break;
                case 'Abstract Reasoning':
                    abstract += isCorrect ? 1 : 0;
                    break;
                case 'Quantitative Aptitude':
                    quant += isCorrect ? 1 : 0;
                    break;
                case 'Verbal Ability':
                    verbal += isCorrect ? 1 : 0;
                    break;
            }
        }

        const rowHtml = `
            <tr>
                <td>${questionId}</td>
                <td>${section}</td>
                <td>${correctOption || '-'}</td>
                <td>${candidateResponse || '-'}</td>
                <td>${isCorrect ? 'Yes' : 'No'}</td>
            </tr>
        `;
        document.getElementById('questions-body').insertAdjacentHTML('beforeend', rowHtml);
    });

    document.getElementById('logical-reasoning').textContent = `${logical}/75`;
    document.getElementById('abstract-reasoning').textContent = `${abstract}/25`;
    document.getElementById('quantitative-aptitude').textContent = `${quant}/50`;
    document.getElementById('verbal-ability').textContent = `${verbal}/50`;

    document.getElementById('total-questions').textContent = 200;
    document.getElementById('correct-answers').textContent = correctCount;
    document.getElementById('total-marks').textContent = `${correctCount}/200`;
    document.getElementById('percentage').textContent = `${((correctCount/200)*100).toFixed(2)}%`;

    document.getElementById('section-summary').classList.remove('hidden');
    document.getElementById('score-summary').classList.remove('hidden');
    document.getElementById('questions-table').classList.remove('hidden');
}
