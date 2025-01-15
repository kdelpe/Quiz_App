const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    serveFile(res, path.join(__dirname, '../client/html/home.html'), 'text/html');
  } else if (req.url === '/quiz' && req.method === 'GET') {
    serveFile(res, path.join(__dirname, '../client/html/quiz.html'), 'text/html');
  } else if (req.url === '/result' && req.method === 'GET') {
    serveFile(res, path.join(__dirname, '../client/html/result.html'), 'text/html');
  } else if (req.url === '/questions' && req.method === 'GET') {
    serveRandomQuestions(res);
  } else if (req.url.startsWith('/client/css/') && req.method === 'GET') {
    serveFile(res, path.join(__dirname, '..', req.url), 'text/css');
  } else if (req.url.startsWith('/client/js/') && req.method === 'GET') {
    serveFile(res, path.join(__dirname, '..', req.url), 'application/javascript');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

function serveRandomQuestions(res) {
  fs.readFile(path.join(__dirname, '../data/questions.json'), (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    const questions = JSON.parse(data);
    const transformedQuestions = questions.map(q => ({
      question: q.question,
      options: [q.A, q.B, q.C, q.D],
      answer: q.answer
    }));
    const randomQuestions = getRandomQuestions(transformedQuestions, 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(randomQuestions));
  });
}

function getRandomQuestions(questions, count) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});