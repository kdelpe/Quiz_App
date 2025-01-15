const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/client',express.static(path.join(__dirname, "../client")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/home.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/quiz.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/result.html'));
});

app.get('/questions', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/questions.json'), (err, data) => {
    if (err) {
      res.status(500).send('500 Internal Server Error');
      return;
    }
    const questions = JSON.parse(data);
    const transformedQuestions = questions.map(q => ({
      question: q.question,
      options: [q.A, q.B, q.C, q.D],
      answer: q.answer
    }));
    const randomQuestions = getRandomQuestions(transformedQuestions, 10);
    res.json(randomQuestions);
  });
});

function getRandomQuestions(questions, count) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});