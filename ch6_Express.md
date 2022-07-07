# Express 서버 구축

## express 는?

편의성을 위해서 http 모듈을 개선한 패키지이다.

## 미들웨어

익스프레스의 꽃! 그런데 이해가 쉽지 않다 😠

```js
app.use(함수);
```

의 형태로 사용한다. 저 함수는 (req, res, next)를 매개변수 로 하는 함수 이다.

에러 처리는 errd이 매개변수로 추가 된다.

```js
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});
```

- [ ] 그럼 모든 경우의 에러를 저게 다 받아 주는 것인가? try-catch를 안써도 된다는 것인지?

### morgan

요청과 응답에 대한 정보를 출력해줌

### static

정적인 파일을 출력해 줌

코드나 사진 파일 같은 것도 띄울 수 있고... 중요한 점은 파일이 없으면 next 호출 (다음 미들웨어로), 파일을 호출 했으면 next 호출을 하지 않는다.

- [ ] 어디에 쓰면 좋을까 이걸?

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

이렇레 브라우저에서 확인하면 뭔가 복잡한게 서명되어 있다.
![cookie](img/img1.png)

쿠키가 브라우저에 저장되니 이 작업은 브라우저에서 (당연히) 해야한다. 포스트맨으로 해놓고 왜 쿠키 안나오지 이러고 있었네 🫠

## express-session
