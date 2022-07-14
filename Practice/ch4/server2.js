const http = require("http");
const fs = require("fs").promises; // 콜백 형식 말고 프로미스 형식으로 사용 가능

http
  .createServer(async (req, res) => {
    try {
      const data = await fs.readFile("./server2.html");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
      res.end(data);
    } catch (err) {
      console.log(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf8" });
      res.end(err.message);
    }
  })
  .listen(8080, () => {
    console.log(`listening on port 8080`);
  });
