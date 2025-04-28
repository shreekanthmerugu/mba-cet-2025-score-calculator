// Handle drag-drop
const uploadBox = document.getElementById('upload-box');
const fileInput = document.getElementById('fileInput');

uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.style.background = '#e0e7ff';
});

uploadBox.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadBox.style.background = '#fff';
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.style.background = '#fff';
  const file = e.dataTransfer.files[0];
  processFile(file);
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  processFile(file);
});

function processFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const htmlString = e.target.result;
    calculateScore(htmlString);
  };
  reader.readAsText(file);
}

function calculateScore(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  let totalQuestions = 0;
  let correctAnswers = 0;

  const rows = doc.querySelectorAll('table.table.table-responsive.table-bordered.center tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length === 2) {
      const correctCell = cells[0];
      const candidateCell = cells[1];

      const correctOption = correctCell.querySelector('span')?.textContent.trim();
      const candidateResponse = candidateCell.querySelector('span')?.textContent.trim();

      if (correctOption && candidateResponse) {
        totalQuestions++;
        if (correctOption === candidateResponse) {
          correctAnswers++;
        }
      }
    }
  });

  const totalMarks = correctAnswers; // +1 mark per correct

  document.getElementById('result').innerHTML = `
    <h3>Total Questions: ${totalQuestions}</h3>
    <h3>Correct Answers: ${correctAnswers}</h3>
    <h3>Total Marks: ${totalMarks}</h3>
  `;
}
