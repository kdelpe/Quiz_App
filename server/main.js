const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/client',express.static(path.join(__dirname, "../client")));

const homeRoute = require('./routes/home');
const quizRoute = require('./routes/quiz');
const resultRoute = require('./routes/result');
const questionsRoute = require('./routes/questions');
const leaderboardRoute = require('./routes/leaderboard');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

app.use('/', homeRoute);
app.use('/quiz', quizRoute);
app.use('/result', resultRoute);
app.use('/questions', questionsRoute);
app.use('/leaderboard', leaderboardRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});