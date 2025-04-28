document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      calculateScore(e.target.result);
    };
    reader.readAsText(file);
  }
});

function calculateScore(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  let totalQuestions = 0;
  let correctAnswers = 0;

  let logicalCorrect = 0;
  let abstractCorrect = 0;
  let quantCorrect = 0;
  let verbalCorrect = 0;

  const tables = doc.querySelectorAll('table.table-bordered.center');

  let questionNumber = 1;

  tables.forEach(table => {
    const spans = table.querySelectorAll('span');
    if (spans.length >= 2) {
      const correctOption = spans[0].textContent.trim();
      const candidateResponse = spans[1].textContent.trim();

      if (correctOption && candidateResponse) {
        totalQuestions++;

        if (correctOption === candidateResponse) {
          correctAnswers++;

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
        questionNumber++;
      }
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
    <hr>
    <h3>🏆 Total Marks: ${totalMarks}/200</h3>

    <div style="margin-top:20px;">
      <a href="https://forms.gle/AB1GPH1cLLck8wVS8" target="_blank" class="upload-btn">Submit Your Response Sheet</a>
    </div>
  `;

  setTimeout(() => {
    resultBox.style.opacity = 1;
  }, 100);
}
