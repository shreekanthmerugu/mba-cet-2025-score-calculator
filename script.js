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
  try {
    const name = doc.querySelector('table tbody tr:nth-child(1) td:nth-child(2)')?.innerText.trim();
    const applicationId = doc.querySelector('table tbody tr:nth-child(2) td:nth-child(2)')?.innerText.trim();

    if (name) document.getElementById('studentName').innerText = name;
    if (applicationId) document.getElementById('applicationId').innerText = applicationId;

    document.getElementById('studentInfo').classList.remove('hidden');
  } catch (error) {
    console.log('Error fetching name and ID');
  }

  const rows = Array.from(doc.querySelectorAll('#tblObjection tbody tr'));
  
  let totalQuestions = 0;
  let correctAnswers = 0;
  let logical = 0, abstract = 0, quant = 0, verbal = 0;
  let logicalCorrect = 0, abstractCorrect = 0, quantCorrect = 0, verbalCorrect = 0;

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;

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
  });

  const totalMarks = correctAnswers;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  document.getElementById('logicalScore').innerText = `${logicalCorrect}/${logical}`;
  document.getElementById('abstractScore').innerText = `${abstractCorrect}/${abstract}`;
  document.getElementById('quantScore').innerText = `${quantCorrect}/${quant}`;
  document.getElementById('verbalScore').innerText = `${verbalCorrect}/${verbal}`;

  document.getElementById('totalQuestions').innerText = totalQuestions;
  document.getElementById('correctAnswers').innerText = correctAnswers;
  document.getElementById('totalMarks').innerText = `${totalMarks}/${totalQuestions}`;
  document.getElementById('percentage').innerText = `${percentage}%`;

  document.getElementById('section-wise-summary').classList.remove('hidden');
  document.getElementById('summary').classList.remove('hidden');
}
