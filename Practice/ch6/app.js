const express = require("express");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
  console.log("모든 요청에 대해 실행");
  next();
});

app.get(
  "/",
  (req, res, next) => {
    console.log("get / 에서 실행");
    next();
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로");
  }
);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "에서 서버 대기 중");
});
