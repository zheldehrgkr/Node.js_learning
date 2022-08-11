const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const pageRouter = require("./routes/page");
const { appendFileSync } = require("fs");

const app = express();
app.set("port", process.env.PORT || 8080);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", pageRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url}라우터가 없습니다`);
  error.status = 404;
  next(error);
});
// 위의 모든 라우터가 실행되고 나서 여기까지 왔다는 것은 요청을 받아줄 페이지가 없었다는 뜻이고 따라서 이러한 논리인듯 하다.
// 그리고 에러 처리 미들웨어로 next(error)을 사용해서 넘어간다.

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
}); // 에러 처리 미들웨어 이거 이해가 잘 안된다. 저 locals는 무엇인가

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버 대기중");
});
