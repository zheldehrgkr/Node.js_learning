const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-Parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json()); // 바디 파서
app.use(express.urlencoded({ extended: false })); // 바디 파서
app.use(cookieParser("secret")); // 쿠키 파서
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

app.use((req, res, next) => {
  console.log("모든 요청에 대해 실행");
  next();
});

app.get(
  "/",
  (req, res, next) => {
    res.cookie("test", "toughcookie", {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: true,
      signed: true,
    });
    res.send("hello cookies");
    // next();
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로");
  }
);

app.get("/cookie", (req, res) => {
  console.log(req.sessionID);
  res.status(200).send(req.cookies);
});

app.get("/signedcookie", (req, res) => {
  res.status(200).send(req.signedCookies);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "에서 서버 대기 중");
});
