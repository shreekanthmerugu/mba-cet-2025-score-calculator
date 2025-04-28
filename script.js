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
    const userInfo = doc.querySelector(".navbar-nav span.hidden-sm.hidden-md");
    if (userInfo) {
        const fullText = userInfo.textContent.trim();
        const parts = fullText.split(' - ');
        document.getElementById('student-name').textContent = parts[1]?.trim() || "-";
        document.getElementById('application-id').textContent = parts[0]?.trim() || "-";
        document.getElementById('student-info').classList.remove('hidden');
    }

    // Now parse Questions
    const rows = [...doc.querySelectorAll("#tblObjection tbody tr")];
    let logical = 0, abstract = 0, quant = 0, verbal = 0, totalCorrect = 0;
    const tbody = document.getElementById('questions-body');
    tbody.innerHTML = '';

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 3) return;

        const questionId = cells[0].textContent.trim();
        const subject = cells[1].textContent.trim();

        let correctOption = "-";
        let userOption = "-";

        const allTexts = cells[2].innerText.split("\n");
        allTexts.forEach(txt => {
            if (txt.includes("Correct Option")) {
                correctOption = txt.split(":")[1]?.trim();
            }
            if (txt.includes("Candidate Response")) {
                userOption = txt.split(":")[1]?.trim();
            }
        });

        const isCorrect = correctOption === userOption ? "Yes" : "No";

        if (isCorrect === "Yes") {
            totalCorrect++;
            if (subject === "Logical Reasoning") logical++;
            if (subject === "Abstract Reasoning") abstract++;
            if (subject === "Quantitative Aptitude") quant++;
            if (subject === "Verbal Ability") verbal++;
        }

        const rowHTML = `
            <tr>
                <td>${questionId}</td>
                <td>${subject}</td>
                <td>${correctOption}</td>
                <td>${userOption}</td>
                <td>${isCorrect}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHTML);
    });

    // Fill Section Wise Summary
    document.getElementById('logical').textContent = `${logical}/75`;
    document.getElementById('abstract').textContent = `${abstract}/25`;
    document.getElementById('quant').textContent = `${quant}/50`;
    document.getElementById('verbal').textContent = `${verbal}/50`;

    // Fill Overall Summary
    document.getElementById('total-questions').textContent = "200";
    document.getElementById('total-score').textContent = totalCorrect;
    document.getElementById('total-marks').textContent = `${totalCorrect}/200`;
    document.getElementById('percentage').textContent = ((totalCorrect/200)*100).toFixed(2) + "%";

    // Finally show everything
    document.getElementById('summary-section').classList.remove('hidden');
    document.getElementById('questions-card').classList.remove('hidden');
}
