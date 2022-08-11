const http = require("http");
const port = 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); // 이 정보는 헤더에 저장
  res.write("hello stranger!"); // 이 정보는 바디에 저장
  res.end("response closed");
});

server.listen(8080);

server.on("listening", () => {
  console.log("서버 대기중");
});

server.on("error", (error) => {
  console.error(error);
});
