const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../../data/questions.json'), (err, data) => {
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

module.exports = router;