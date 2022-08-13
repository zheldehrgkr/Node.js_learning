const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-type': 'text/html; charset=utf-8' });
    res.write('<h1>hello wolrd!<h1>');
    res.end('<p>hello server!<p>');
  })
  .listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중');
  });
