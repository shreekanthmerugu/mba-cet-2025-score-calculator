document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    parseHTML(e.target.result);
  };
  reader.readAsText(file);
}

function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Fetch Student Name and Application ID
  const userInfo = doc.querySelector('.nav-link.dropdown-toggle span')?.innerText.trim() || "Unknown";
  let applicationId = "Unknown";
  let name = "Unknown";

  if (userInfo.includes(' - ')) {
    const [id, ...nameParts] = userInfo.split(' - ');
    applicationId = id.trim();
    name = nameParts.join(' ').trim();
  }

  document.getElementById('studentName').innerText = name || 'Unknown';
  document.getElementById('applicationId').innerText = applicationId || 'Unknown';
  document.getElementById('student-info').classList.remove('hidden');

  // Parse Questions
  const rows = Array.from(doc.querySelectorAll('#tblObjection tbody tr'));
  const questionRows = document.getElementById('questionRows');
  questionRows.innerHTML = "";

  let totalQuestions = 0;
  let correctAnswers = 0;
  let logical = 0, abstract = 0, quant = 0, verbal = 0;
  let logicalCorrect = 0, abstractCorrect = 0, quantCorrect = 0, verbalCorrect = 0;

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;

    const questionId = cells[0]?.innerText.trim(); // ✅ Actual Question ID
    const subject = cells[1]?.innerText.trim();
    const optionsCell = cells[2];
    const spans = optionsCell.querySelectorAll('span');
    const correctOption = spans[0]?.innerText.trim();
    const userOption = spans[1]?.innerText.trim();

    if (!correctOption || !userOption) return;

    const isCorrect = correctOption === userOption;

    if (subject.includes('Logical')) {
      logical++;
      if (isCorrect) logicalCorrect++;
    } else if (subject.includes('Abstract')) {
      abstract++;
      if (isCorrect) abstractCorrect++;
    } else if (subject.includes('Quantitative')) {
      quant++;
      if (isCorrect) quantCorrect++;
    } else if (subject.includes('Verbal')) {
      verbal++;
      if (isCorrect) verbalCorrect++;
    }

    totalQuestions++;
    if (isCorrect) correctAnswers++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${questionId}</td>
      <td>${subject}</td>
      <td>${correctOption}</td>
      <td>${userOption}</td>
      <td><span class="${isCorrect ? 'yes' : 'no'}">${isCorrect ? 'Yes' : 'No'}</span></td>
    `;
    questionRows.appendChild(tr);
  });

  document.getElementById('questions-table').classList.remove('hidden');

  // Summary Section
  const totalMarks = correctAnswers;
  const summaryTable = document.getElementById('summary-table');
  summaryTable.innerHTML = `
    <tr><td><strong>Total Questions:</strong></td><td>${totalQuestions}</td></tr>
    <tr><td><strong>Correct Answers:</strong></td><td>${correctAnswers}</td></tr>
    <tr><td><strong>Percentage:</strong></td><td>${((correctAnswers / totalQuestions) * 100).toFixed(2)}%</td></tr>
    <tr><td><strong>Total Marks:</strong></td><td>${totalMarks}/${totalQuestions}</td></tr>
    <tr><td><strong>Logical Reasoning:</strong></td><td>${logicalCorrect}/${logical}</td></tr>
    <tr><td><strong>Abstract Reasoning:</strong></td><td>${abstractCorrect}/${abstract}</td></tr>
    <tr><td><strong>Quantitative Aptitude:</strong></td><td>${quantCorrect}/${quant}</td></tr>
    <tr><td><strong>Verbal Ability:</strong></td><td>${verbalCorrect}/${verbal}</td></tr>
  `;

  document.getElementById('score-summary').classList.remove('hidden');
}
