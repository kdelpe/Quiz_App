const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, '../audio')));
app.use('/client',express.static(path.join(__dirname, "../client")));
app.use('/data',express.static(path.join(__dirname, "../data")));
app.use('/images',express.static(path.join(__dirname, "../images")));
app.use('/settings',express.static(path.join(__dirname, "../settings")));

const homeRoute = require('./routes/home');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const quizRoute = require('./routes/quiz');
const profileRoute = require('./routes/profile');
const leaderboardRoute = require('./routes/leaderboard');
const settingsRoute = require('./routes/settings');

app.use('/', homeRoute);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);
app.use('/quiz', quizRoute);
app.use('/leaderboard', leaderboardRoute);
app.use('/settings', settingsRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});