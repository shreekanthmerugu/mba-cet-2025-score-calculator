function calculateScore(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  let totalQuestions = 0;
  let correctAnswers = 0;

  let logicalCorrect = 0;
  let abstractCorrect = 0;
  let quantCorrect = 0;
  let verbalCorrect = 0;

  const rows = doc.querySelectorAll('table.table.table-responsive.table-bordered.center tr');

  let questionNumber = 1; // We assume questions are ordered 1 to 200.

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

          // Section wise counting
          if (questionNumber <= 75) {
            logicalCorrect++;
          } else if (questionNumber <= 100) {
            abstractCorrect++;
          } else if (questionNumber <= 150) {
            quantCorrect++;
          } else {
            verbalCorrect++;
          }
        }
      }
      questionNumber++;
    }
  });

  const totalMarks = correctAnswers;

  const resultBox = document.getElementById('result');
  resultBox.style.opacity = 0;
  resultBox.innerHTML = `
    <h3>Section-Wise Scores:</h3>
    <p>🧠 Logical Reasoning: ${logicalCorrect}/75</p>
    <p>🎨 Abstract Reasoning: ${abstractCorrect}/25</p>
    <p>📈 Quantitative Aptitude: ${quantCorrect}/50</p>
    <p>📚 Verbal Ability: ${verbalCorrect}/50</p>
    <hr style="margin: 20px 0; opacity: 0.3;">
    <h3>🏆 Total Marks: ${totalMarks}/200</h3>

    <div style="margin-top:20px;">
      <a href="https://forms.gle/H6CqWfuL4bGkJkXT9" target="_blank" class="upload-btn">Submit Your Response Sheet</a>
    </div>
  `;

  setTimeout(() => {
    resultBox.style.transition = "opacity 0.8s ease";
    resultBox.style.opacity = 1;
  }, 100);
}
