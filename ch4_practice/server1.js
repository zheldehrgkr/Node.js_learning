const http = require("http");
const port = 8080;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.write("hello stranger!");
    res.end("response closed");
  })
  .listen(port, () => {
    console.log(`${port}번 포트에서 대기 중...`);
  });
