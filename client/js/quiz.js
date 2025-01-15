document.getElementById('view-results-btn').addEventListener('click', function() {
    window.location.href = '/result';
  });

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/questions');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const questions = await response.json();
    displayQuestions(questions);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});
  
function displayQuestions(questions) {
  const quizContainer = document.getElementById('quiz-container');
  questions.forEach((question, index) => {
    if (!question.options || !Array.isArray(question.options)) {
      console.error(`Question ${index + 1} is missing options or options is not an array`);
      return;
    }
    const questionElement = createQuestionElement(question, index);
    quizContainer.appendChild(questionElement);
  });
}

function createQuestionElement(question, index) {
  const questionElement = document.createElement('div');
  questionElement.classList.add('question');
  questionElement.innerHTML = `
    <h2>Question ${index + 1}</h2>
    <p>${question.question}</p>
    ${question.options.map((option, i) => `
      <label>
        <input type="radio" name="question${index}" value="${option}">
        ${option}
      </label>
    `).join('')}
  `;
  return questionElement;
}