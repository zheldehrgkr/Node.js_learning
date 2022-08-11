const http = require("http");

http
  .createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { "Set-cookie": "cookie=test" });
    res.end("cookie sample");
  })
  .listen(8080, () => {
    console.log("서버 대기중");
  });
