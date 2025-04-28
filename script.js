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

  // Extract Student Name and Application ID
  const spans = doc.querySelectorAll('span');
  let studentName = 'Unknown';
  let applicationID = 'Unknown';

  spans.forEach(span => {
    if (span.textContent.includes('Name')) {
      studentName = span.nextElementSibling?.textContent.trim() || 'Unknown';
    }
    if (span.textContent.includes('Application')) {
      applicationID = span.nextElementSibling?.textContent.trim() || 'Unknown';
    }
  });

  document.getElementById('studentInfo').innerHTML = `
    <h2>Student Details</h2>
    <p><strong>Name:</strong> ${studentName}</p>
    <p><strong>Application ID:</strong> ${applicationID}</p>
  `;

  // Now parse the questions
  const tables = doc.querySelectorAll('table.table-bordered.center');

  let totalQuestions = 0;
  let correctAnswers = 0;

  let logicalCorrect = 0;
  let abstractCorrect = 0;
  let quantCorrect = 0;
  let verbalCorrect = 0;

  let questionNumber = 1;
  let fullResultHTML = `
    <table class="result-table">
      <tr>
        <th>Q.No</th>
        <th>Subject</th>
        <th>Correct Option</th>
        <th>User Option</th>
        <th>Is Correct?</th>
      </tr>
  `;

  tables.forEach(table => {
    const spans = table.querySelectorAll('span');
    if (spans.length >= 2) {
      const correctOption = spans[0].textContent.trim();
      const candidateResponse = spans[1].textContent.trim();

      if (correctOption && candidateResponse) {
        totalQuestions++;

        let subject = '';
        if (questionNumber <= 75) {
          subject = 'Logical Reasoning';
        } else if (questionNumber <= 100) {
          subject = 'Abstract Reasoning';
        } else if (questionNumber <= 150) {
          subject = 'Quantitative Aptitude';
        } else {
          subject = 'Verbal Ability';
        }

        let isCorrect = (correctOption === candidateResponse);
        if (isCorrect) {
          correctAnswers++;
          if (questionNumber <= 75) logicalCorrect++;
          else if (questionNumber <= 100) abstractCorrect++;
          else if (questionNumber <= 150) quantCorrect++;
          else verbalCorrect++;
        }

        fullResultHTML += `
          <tr>
            <td>${questionNumber}</td>
            <td>${subject}</td>
            <td>${correctOption}</td>
            <td>${candidateResponse}</td>
            <td><span class="${isCorrect ? 'badge-yes' : 'badge-no'}">${isCorrect ? 'Yes' : 'No'}</span></td>
          </tr>
        `;

        questionNumber++;
      }
    }
  });

  fullResultHTML += `</table>`;

  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  document.getElementById('summary').innerHTML = `
    <h2>Summary</h2>
    <p><strong>Total Questions:</strong> ${totalQuestions}</p>
    <p><strong>Correct Answers:</strong> ${correctAnswers}</p>
    <p><strong>Percentage:</strong> ${percentage}%</p>
    <p><strong>Total Marks:</strong> ${correctAnswers}/200</p>
    <p><strong>Logical Reasoning:</strong> ${logicalCorrect}/75</p>
    <p><strong>Abstract Reasoning:</strong> ${abstractCorrect}/25</p>
    <p><strong>Quantitative Aptitude:</strong> ${quantCorrect}/50</p>
    <p><strong>Verbal Ability:</strong> ${verbalCorrect}/50</p>
    <div class="important-message" style="margin-top:20px;">
      📸 <b>Please take a screenshot of this page and upload it in the Google Form to verify your scores.</b>
    </div>
    <div style="margin-top:20px;">
      <a href="YOUR_GOOGLE_FORM_LINK_HERE" target="_blank" class="upload-btn">Submit Your Response Sheet</a>
    </div>
  `;

  document.getElementById('result').innerHTML = fullResultHTML;
}
