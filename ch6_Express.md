# Express 서버 구축

## express 는?

편의성을 위해서 http 모듈을 개선한 패키지이다.

기초 뼈대 모양

```js
const express = require("express");

const app = express();
app.set("port", process.env.PORT || 3000); // 포 실ㅇ

app.get("/", (req, res) => {
  // 인수로 주어진 주소의 get 요청에 대한 응답
  res.send("hello express");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "에서 서버 대기 중");
}); // 서버 실행
```

app.get처럼 http 메소드에 대한 app.xxx 메소드가 있다.

## 미들웨어

익스프레스의 꽃! 그런데 이해가 쉽지 않다 😠

```js
app.use(함수);
```

의 형태로 사용한다. app.use면 모든 요청에서 실행한다. app.get 으로 설정하면 get 요청에서만 실행한다.
함수는 (req, res, next)를 매개변수 로 하는 함수이다.
첫 번째 인수로 주소를 넣을 수 있는데 그러면 해당하는 요청에서만 실행된다.

다음의 예제는 따라서 / 주소의 get 요청일 때만 실행한다.

```js
app.get(
  "/",
  (req, res, next) => {
    console.log("get 요청, / 에서 실행");
    next(); // 이 부분을 주석처리하면
  },
  // 이 밑으로는 실행되지 않는다!
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로");
  }
);
```

next();는 다음 미들웨어를 실행하는 함수이다.

특별히 에러 처리는 err이 매개변수로 추가 된다.

```js
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});
```

- [ ] 그럼 모든 경우의 에러를 저게 다 받아 주는 것인가? try-catch를 안써도 된다는 것인지? 프로세스가 멈추지 않는 것인가?

### morgan

요청과 응답에 대한 정보를 출력해줌

### static

정적인 파일을 출력해 줌

코드나 사진 파일 같은 것도 띄울 수 있고... 중요한 점은 파일이 없으면 next 호출 (다음 미들웨어로), 파일을 호출 했으면 next 호출을 하지 않는다.

- [ ] 어떤 용도로 쓸 수 있을까? 다음 미들웨어를 호출하지 않기 때문에...

### body-parser

요청 본문의 데이터를 객체로 만들어 주는 (이걸 파싱이라고 하나보군) 기능이 있다.
패키지가 따로 있는데 일부 기능이 익스프레스에 자체 추가 되어서 안깔아도 사용 가능함.
**그래서 정확히 뭐를 뭘로 바꿔준다는 것인가?**

확인해보자. 일단 사용을 위해서 미들웨어를 가져오고,

```js
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

req.body에 저장된다고 했으니 확인할 코드를 작성

```js
app.post("/", (req, res) => {
  console.log(req.body);
});
```

포스트맨으로 **json을 요청 body에 담아서** 보내면

```json
{ "test": "body-parser" }
```

다음과 같이 **객체**의 형태로 req.body에 담기게 된다.

```bash
{ test: 'body-parser' } // console.log(req.body);
```

즉 json(요청) -> 객체(req.body)로 바꿔줌
내장으로는 json, URL-encoded가 해석가능 하고 패키지를 깔면 Raw, text 형식도 해 준다고 한다.

- [ ] extended 옵션, URL-encoded 형식에 대해서 체크해 보기

## cookie-parser

이번에는 요청 본문이 아니라 쿠키를 해석해 req.cookies 객체로 만들어 주는 미들웨어다.

사용법 (비밀키는 이따 다시 살펴보자)

```js
app.use(cookieParser(비밀키));
```

쿠키파서는 단순히 쿠키를 객체로 바꿔줄 뿐 직접 쿠키를 만들거나 지우지는 않는다.
쿠키 생성은 res.cookie로 한다.

```js
app.get("/", (req, res) => {
  res.cookie("test", "toughcookie", {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
  });
  res.send("hello cookies");
});
```

get /cookie 요청으로 req.cookies를 확인할 수 있도록 해보자.

```js
app.get("/cookie", (req, res) => {
  res.status(200).send(req.cookies);
});
```

localhost:3000/cookie로 접속하면 이렇게 뜸

```js
{"test":"toughcookie"}
```

아까 cookieParser()안에 비밀키를 입력하면 쿠키에 서명을 할 수 있다.
이 경우 req.cookies 가 아닌 req.signedCookies에 파싱 결과가 저장된다.
만들 때 서명을 사용하도록 변경

```js

app.use(cookieParser("secret")); // 비밀키 입력

...

app.get("/", (req, res) => {
  res.cookie("test", "toughcookie", {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
    signed: true, // 이 부분!
  });
  res.send("hello cookies");
});
```

이번에는 req.signedCookies를 확인한다.

```js
app.get("/signedcookie", (req, res) => {
  res.status(200).send(req.signedCookies);
});
```

파싱 결과는 같다. 하지만...

```js
{"test":"toughcookie"}
```

이렇레 브라우저에서 확인하면 signed 적용되어 뭔가 복잡한게 서명되어 있다.
![cookie](img/img1.png)

쿠키가 브라우저에 저장되니 이 작업은 브라우저에서 (당연히) 해야한다. 포스트맨으로 해놓고 왜 쿠키 안나오지 이러고 있었네 🫠

## express-session

쿠키 했으니까 세션이다.

## 미들웨어 추가 정보

- 미들웨어는 next() 를 호출하거나 응답 (res.send, res.sendFile)을 보내야 한다. 그러지 않으면 클라이언트는 계속 기다려댜 함
- next('route'); 로 호출하면 같은 라우터의 미들웨어를 다 건너뛰고 다음 라우터로 이동한다.
- next('route 말고 아무거나'); 로 호풀하면 에러 처리 미들웨어로 이동한다.
- req 객체에 데이터를 저장해서 미들웨어 간 데이터 공유가 가능하다.

### multer

- [ ] 공부하기 : multipart 형식의 업로드

## 라우팅

익스프레스의 강점 중 하나는 깔끔하게 라우팅을 할 수 있기 때문이다.

구조를 알아보면 일단 routes 폴더 밑에 파일을 생성해서 라우터를 생성하고 모듈로 만듦.

```text
routes/user.js
```

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello, this is user page");
});

module.exports = router;
```

app.js에서는 모듈을 불러오고 미들웨어를 사용해서 라우팅을 한다.
첫 번째 인자인 주소 '/user'로의 요청을 모든 요청을 (app.use니까)불러온 userRouter가 처리하게 하고 있다.

```text
app.js
```

```js
...

const userRouter = require("./routes/user");

app.use("/user", userRouter);

app.use((req, res, next) => {
  res.status(404).send("not found");
});

...
```

어떻게 작성해야 하는지는 알겠는데 의문점이 몇 가지 남는다.

- [ ] export 한 것은 router, 즉 = express.Router() 인데 정확히 저것은 무엇인가? 저것의 구조에 대해서 더 알아봐야겠음
- [ ] 결국 불러와지는 것은 router = express.Router() 인가 router.get이 자동으로 실행되는게 맞나?
- [ ] router.get() 의 두 번째 인자는 미들웨어인가? 매개변수에 next가 없는 이유는?
- [ ] 모듈에 대해서 좀 더 공부해 보기

이해를 못 한 것인지 굉장히 모호하게 느껴진다.

## req, res

req, res 는 http 모듈의 객체를 확장한 것으로 http의 메소드를 포함해서 추가 메소드들을 가지고 있다.
메서드 체이닝을 지원하는 경우가 많다.

좀 흥미로운 것은 res.send가 http에도 있는 줄 알았는데 공식문서를 보니까 node의 http 모듈에는 res.send가 없고 그 기능을 res.write가 하는 것으로 보였다.

- [ ] res.send와 res.write의 차이점은?

각 메서드에 대한 것은 나열하는 것보다는 읽어보고 필요할 때 적용하는 것이 좋아 보인다.

## 템플릿 엔진

- [ ] 공부하기
