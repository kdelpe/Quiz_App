let fullQuizData = []; 
let quizData = []

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.querySelector('.progress-bar');
const quizContainer = document.getElementById('quiz');
  
async function fetchQuizData() {
    try {
        const response = await fetch('/data/questions.json');
        fullQuizData = await response.json();

        quizData = getRandomQuestions(fullQuizData, 10);

        loadQuestion();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

function getRandomQuestions(allQuestions, count) {
  const shuffled = [...allQuestions];

  shuffled.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(button, index));
        optionsEl.appendChild(button);
    });
    timeLeft = 30;
    if (timer) clearInterval(timer);
    startTimer();
    updateProgress();
}
  
function selectOption(selectedButton, optionIndex) {
    const buttons = optionsEl.getElementsByClassName('option');
    Array.from(buttons).forEach(button => button.classList.remove('selected'));
    selectedButton.classList.add('selected');
    nextBtn.style.display = 'block';
}
  
function startTimer() {
    timerEl.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;
        if (timeLeft === 0) {
          clearInterval(timer);
          checkAnswer();
          currentQuestion++;

          if (currentQuestion < quizData.length) {
            loadQuestion();
          } else {
            showResults();
          }
        }
    }, 1000);
}
  
function checkAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) return;

    const selectedAnswer = Array.from(optionsEl.children).indexOf(selectedOption);
    const question = quizData[currentQuestion];

    if (selectedAnswer === question.correct) {
        score++;
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('incorrect');
        optionsEl.children[question.correct].classList.add('correct');
    }

    Array.from(optionsEl.children).forEach(button => button.disabled = true);
    clearInterval(timer);
}
  
function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}
  
async function updateLeaderboard(score) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        console.error('No user logged in');
        return;
    }

    try {
        const response = await fetch('/leaderboard/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: currentUser.username,
                score: score.toString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update score');
        }
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

async function showResults() {
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset playback position
    }

    let resultMusic;
    if (score <= 1) {
        resultMusic = '/audio/lowest-score-audio.mp3';
    } else if (score <= 4) {
        resultMusic = '/audio/low-score-audio.mp3';
    } else if (score <= 6) {
        resultMusic = '/audio/medium-score-audio.mp3';
    } else {
        resultMusic = '/audio/high-score-audio.mp3';
    }

    // Play the selected audio based on scores
    const resultAudio = new Audio(resultMusic);
    resultAudio.play();

    await updateLeaderboard(score);

    quizContainer.innerHTML = `
        <div class="results">
            <div class="result-icon">
                <i class="fas ${score > quizData.length / 2 ? 'fa-trophy text-success' : 'fa-times-circle text-danger'}"></i>
            </div>
            <div class="score">Your score: ${score}/${quizData.length}</div>
            <p>${score > quizData.length / 2 ? 'Great job!' : 'Better luck next time!'}</p>
            <div class="button-container">
                <button class="btn btn-primary" onclick="location.reload()">Restart Quiz</button>
                <button class="btn btn-secondary" onclick="window.location.href='/leaderboard'">View Leaderboard</button>
            </div>
        </div>
    `;
}
  
nextBtn.addEventListener('click', () => {
    clearInterval(timer);
    checkAnswer();
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});
  
fetchQuizData();