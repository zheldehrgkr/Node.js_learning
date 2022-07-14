// 주어진 프론트와 api 명세서로 서버 구축하는 연습, 책 코드 보지 않고 최대한 스스로 해보기

const http = require("http");
const fs = require("fs").promises;

const users = {};

http
  .createServer(async (req, res) => {
    console.log(req.method);
    console.log(req.url);

    if (req.method === "GET") {
      if (req.url === "/") {
        const data = await fs.readFile("./restFront.html");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(data);
      } else if (req.url === "/about") {
        const data = await fs.readFile("./about.html");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(data);
      } else if (req.url === "/users") {
        res.writeHead(200, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        return res.end(JSON.stringify(users));
      }
      try {
        const data = await fs.readFile(`.${req.url}`);
        return res.end(data);
      } catch (err) {
        console.log(err);
        res.writeHead(404);
        return res.end("NOT FOUND");
      }
    } else if (req.method === "POST") {
      if (req.url === "/user") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        return req.on("end", () => {
          // return 생략하고 바로 .on으로 이어붙이면 어쨰서 작동하지 않는가
          const { name } = JSON.parse(body);
          const id = Date.now();
          users[id] = name;
          res.writeHead(201);
          res.end("등록 성공");
        });
      }
    } else if (req.method === "PUT") {
      if (req.url.startsWith("/user/")) {
        // string.startsWith() : 인자로 받은 문자열로 시작하면 true 리턴
        const key = req.url.split("/")[2]; // string.split() : 인자로 받은 문자열을 기준으로 나눈 배열을 리턴
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        return req.on("end", () => {
          users[key] = JSON.parse(body).name; // name은 왜 붙는 거임? JSON.parse(body)의 결과는 객체이고 .name은 프로퍼티 접근인 건 알겠는데, name 프로퍼티를 가지고 있는 이유가 뭐지?
          res.end(JSON.stringify(users));
        });
      }
    } else if (req.method === "DELETE") {
      if (req.url.startsWith("/user/")) {
        const key = req.url.split("/")[2];
        delete users[key];
        return res.end(JSON.stringify(users));
      }
    }
    res.writeHead(404);
    return res.end("NOT FOUND");
  })
  .listen(8080, () => {
    console.log("8080번 포트에서 서버 대기중");
  });
