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

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});