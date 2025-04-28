document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        parseHTML(content);
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Fetch Name and Application ID
    const userInfo = doc.querySelector('.navbar-nav .nav-link span.hidden-sm.hidden-md');
    if (userInfo) {
        const [appId, ...nameParts] = userInfo.textContent.trim().split(' - ');
        document.getElementById('student-name').textContent = nameParts.join(' - ');
        document.getElementById('application-id').textContent = appId;
        document.getElementById('student-info').classList.remove('hidden');
    }

    // Fetch Questions
    const rows = [...doc.querySelectorAll('#tblObjection tbody tr')];
    let totalCorrect = 0, logical = 0, abstract = 0, quant = 0, verbal = 0;
    const tbody = document.getElementById('questions-body');
    tbody.innerHTML = '';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) return;

        const qId = cells[0].innerText.trim();
        const subject = cells[1].innerText.trim();
        const correctOption = cells[2].querySelector('b:contains("Correct Option:") ~ span')?.innerText.trim();
        const userOption = cells[2].querySelector('b:contains("Candidate Response:") ~ span')?.innerText.trim();

        let correct = correctOption && userOption && correctOption === userOption ? 'Yes' : 'No';
        if (correct === 'Yes') {
            totalCorrect++;
            if (subject === "Logical Reasoning") logical++;
            if (subject === "Abstract Reasoning") abstract++;
            if (subject === "Quantitative Aptitude") quant++;
            if (subject === "Verbal Ability") verbal++;
        }

        const rowHTML = `
            <tr>
                <td>${qId}</td>
                <td>${subject}</td>
                <td>${correctOption || '-'}</td>
                <td>${userOption || '-'}</td>
                <td>${correct}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHTML);
    });

    // Fill Summary
    document.getElementById('logical').textContent = `${logical}/75`;
    document.getElementById('abstract').textContent = `${abstract}/25`;
    document.getElementById('quant').textContent = `${quant}/50`;
    document.getElementById('verbal').textContent = `${verbal}/50`;

    document.getElementById('total-questions').textContent = 200;
    document.getElementById('total-score').textContent = totalCorrect;
    document.getElementById('total-marks').textContent = `${totalCorrect}/200`;
    document.getElementById('percentage').textContent = `${((totalCorrect/200)*100).toFixed(2)}%`;

    document.getElementById('summary-section').classList.remove('hidden');
    document.getElementById('questions-card').classList.remove('hidden');
}
