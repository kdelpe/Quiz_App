let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let isPaused = false;
let pausedTimeLeft = 30;

let quizData = [];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.querySelector('.progress-bar');
const quizContainer = document.getElementById('quiz');
const modal = document.getElementById('confirm-modal');
const confirmEnd = document.getElementById('confirm-end');
const cancelEnd = document.getElementById('cancel-end');
const endQuizButton = document.getElementById('return-button');

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

async function fetchQuizData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.results.length < 10) {
            console.error('Insufficient questions returned from API');
            return;
        }

        quizData = data.results.sort(() => Math.random() - 0.5);
        loadQuestion();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = decodeHtml(question.question);
    optionsEl.innerHTML = '';

    const options = [...question.incorrect_answers, question.correct_answer].map(decodeHtml);
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(button, option));
        optionsEl.appendChild(button);
    });

    timeLeft = 30;
    if (timer) clearInterval(timer);
    startTimer();
    updateProgress();
}

function selectOption(button, selectedAnswer) {
    clearInterval(timer);

    const question = quizData[currentQuestion];
    const correctAnswer = question.correct_answer;

    if (selectedAnswer === correctAnswer) {
        score++;
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
        Array.from(optionsEl.children).forEach(optionButton => {
            if (optionButton.textContent === correctAnswer) {
                optionButton.classList.add('correct');
            }
        });
    }

    Array.from(optionsEl.children).forEach(optionButton => {
        optionButton.disabled = true;
    });

    nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
    clearInterval(timer);
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
    nextBtn.style.display = 'none';
});

function startTimer() {
    timerEl.textContent = `Time: 00:${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: 00:${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }
    }, 1000);
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
        backgroundMusic.currentTime = 0;
    }

    let resultMusic;
    let resultGif;

    if (score <= 1) {
        resultMusic = '/audio/lowest-score-audio.mp3';
        resultGif = 'https://media.giphy.com/media/xT1XGWbE0XiBDX2T8Q/giphy.gif';
    } else if (score <= 4) {
        resultMusic = '/audio/low-score-audio.mp3';
        resultGif = 'https://media.giphy.com/media/ORXoD0V3d9u2QPzBLX/giphy.gif';
    } else if (score <= 6) {
        resultMusic = '/audio/medium-score-audio.mp3';
        resultGif = 'https://media.giphy.com/media/4PT6v3PQKG6Yg/giphy.gif';
    } else {
        resultMusic = '/audio/high-score-audio.mp3';
        resultGif = 'https://media2.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif';
    }

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
            <div class="result-gif">
                <img src="${resultGif}" alt=""/>
            </div>
        </div>
    `;
    endQuizButton.textContent = "Home";
    endQuizButton.onclick = () => {
        window.location.href = '/client/html/profile.html';
    };
}

endQuizButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearInterval(timer);
    isPaused = true;
    pausedTimeLeft = timeLeft;
    modal.classList.remove('hidden');
});

confirmEnd.addEventListener('click', () => {
    modal.classList.add('hidden');
    showResults();
});

cancelEnd.addEventListener('click', () => {
    modal.classList.add('hidden');
    isPaused = false;
    timeLeft = pausedTimeLeft;
    startTimer();
});

fetchQuizData();


