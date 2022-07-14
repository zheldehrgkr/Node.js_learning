# 노드 사용법과 기본 객체/모듈 사용법 등 소개

## repl

터미널에서 js 실행 가능

## js 파일

파일로 js 실행 가능

## 모듈

노드는 모듈 기능을 제공한다.

내보내는 쪽은

```js
moduls.exports = 내보낼 것;
```

사용하는 쪽은

```js
const 받아온 것 = require('경로');
```

으로 사용할 수 있다.
여러 파일에서 사용되는 함수, 변수, 객체 등을 모듈로 만들면 재사용이 편리하다.
but 너무 많아지면 구조가 복잡해진다.

es6에서 Js 자체에도 모듈 기능이 추가 되었다.

```js
import 받는 것 from 경로;

// 코드

export default 내보내는 것;
```

이런 식으로 작동함. 노드 9 버젼 부터 이 방식도 추가 지원함.

## 내장 객체

별도 설치 없이 사용할 수 있는 객체들, 브라우저에서의 window과 비슷한 개념이다.

- global : 전역 객체, window와 마찬가지로 생략가능
- console : global 객체 에 들어있음, 디버깅시 유용
- 타이머 : 웹 브라우저에서 지원하는 타이머들 지원함
- \_\_filename, \_\_dirname : 파일명, 경로 제공
- module, export, require : 모듈 생성과 불러오는 기능 제공

- [x] 예제 실습하면서 상세 내용 확인

### process : 실행 중인 노드의 정보

process.nextTick이라는 특별한 게 있어서 따로 리스팅.  
nextTick의 콜백을 다른 콜백함수보다 이벤트 루프가 먼저 처리하게 만듬.  
promise도 그렇다고 하며 이 둘을 마이크로태스크라고 따로 부른다고 함  
콜 스택이 비어있으면 태스크 큐보다 먼저 실행

- [ ] js책 ch.45 promise 추가 학습하기

## 각종 내장 모듈

노드는 브라우저 js보다 많은 기능을 제공한다.

- os : 운영체제 정보
- path : 경로 조작을 도와줌, 운영체제별로 다른 경로 구분자 처리에 유용
- url : 인터넷 주소 조작으 도와주는 모듈
- querystring : 기존 노드의 방식의 url 다룰 때 사용
- crypto : 암호화
- util : 각종 편의 기능
- worker_threads : 노드에서 멀티 스레드 방식으로 작업할 수 있음
- child_process : 노드에서 다른 프로그램 실행할 때 사용

기타 등등..

- [ ] 개별 메소드 추가 학습해 보기
- [x] crypto로 프로젝트 2 리팩토링 해보기
- [ ] 노드의 멀티 스레딩에 대해서 좀 더 알아보기

## fs 모듈

파일 시스템이 접근하는 모듈, 예컨대 readFile로 파일을 읽어 올 수 있음.
fs모듈에서 중요한 점 두 가지,

- 비동기적으로 실행된다. 단 ~sync 끝나는 메소드들은 동기적으로 작동하나 성능 문제로 권장되지 않음
- 결과를 **_버퍼_**로 반환한다.

### 버퍼와 스트림

버퍼 : 파일 크기 만큼 메모리를 확보한 후 저장한다. 편리하지만 메모리를 한꺼번에 많이 쓰고  
스트림 : 버퍼를 작게 만들어 여러 번에 나눠 보내는 방식을 스트림이라고 한다.

```js
const fs = require("fs");

const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 });
const data = [];

readStream.on("data", (chunk) => {
  // 'data'는 이벤트이다
  data.push(chunk);
  console.log("data :", chunk, chunk.length);
}); // 스트림 청크 단위로 출력

readStream.on("end", () => {
  console.log("end :", Buffer.concat(data).toString());
}); // 버퍼 (그리고 toString)로 리턴

readStream.on("error", (err) => {
  console.log("error :", err);
});
```

```text
data : <Buffer eb b9 84 ea b0 80 20 eb 82 b4 eb a6 ac eb 8a 94> 16
data : <Buffer 20 eb 82 a0 ec 97 94 0a ec 9a b0 eb a6 ac 20 eb> 16
data : <Buffer b0 a9 ec 95 88 ec 97 90 20 eb 88 84 ec 9b 8c 20> 16
data : <Buffer ec 95 84 eb ac b4 20 eb a7 90 ec 9d b4 20 ec 97> 16
data : <Buffer 86 ea b3 a0 0a ea b0 90 ec 9d 80 20 eb 88 88 ec> 16
data : <Buffer 9d 84 20 eb a7 88 ec a3 bc 20 eb b3 b4 eb a9 b4> 16
data : <Buffer 20 eb aa a8 eb 93 a0 20 ea b2 8c 20 ec 9a b0 eb> 16
data : <Buffer a6 ac ea b1 b0 ec 95 bc 0a ec a1 b0 ea b8 88 20> 16
data : <Buffer ed 95 bc ec 91 a5 ed 95 9c 20 ec 96 bc ea b5 b4> 16
data : <Buffer eb a1 9c 20 eb 82 a0 20 ec b0 be ec 95 84 ec 98> 16
data : <Buffer ac 20 eb 95 8c eb 8f 84 0a ea b0 80 eb 81 94 20> 16
data : <Buffer eb b0 9c ec b9 99 ed 95 9c 20 ec 96 98 ea b8 b0> 16
data : <Buffer eb a1 9c 20 eb 82 a0 20 eb 86 80 eb 9e 98 ed 82> 16
data : <Buffer ac 20 eb 95 8c eb 8f 84> 8
end : 비가 내리는 날엔
우리 방안에 누워 아무 말이 없고
감은 눈을 마주 보면 모든 게 우리거야
조금 핼쑥한 얼굴로 날 찾아올 때도
가끔 발칙한 얘기로 날 놀래킬 때도
```

- [ ] 스레드풀 학습
- [ ] 세부 메소드 학습

## 이벤트

```js
const EventEmitter = require("events");

const myEvent = new EventEmitter();

myEvent.addListener("event", () => {
  console.log("event occured");
});
myEvent.on("event2", () => {
  console.log("event occured");
});
myEvent.emit(event);
myEvent.emit(event2);
```

events 모듈로 사용 가능하다. addListener와 on으로 이름-콜백함수를 연결하고 emit로 실행한다!

```js
readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("data :", chunk, chunk.length);
});
```

위와 같은 예제에서도 겉으로 드러나지는 않았지만 내부적으로 이벤트가 작동하는 것!

- [ ] js책 ch40 이벤트 학습

## 예외 처리

예외 처리는 노드에서 특히 더 중요한데, 싱글 스레드로 동작하므로 하나가 멈추면 전체 서버가 멈추게 되기 때문이다.
일단 코드의 문법에는 (당연히) 문제가 없어야 한다. 특히 컴파일 하지 않는 js의 특성상 더 그럴 듯.

그 다음으로 에러가 나도 프로세스가 멈추지 않게 작업을 해야 한다.

### try-catch

에러가 날 것 같은 부분을 미리 try-catch로 처리하면 프로세스가 멈추지 않는다.

```js
setInterval(() => {
  console.log("시작");
  try {
    throw new Error("서버 오류");
    // try-catch 를 하지 않으면 throw 한 경우 프로세스 정지
  } catch (err) {
    console.log(err);
  }
}, 1000);
// 프로세스 종료 되지 않음
```

### uncaughtException

process 객체에 uncaughtException 이벤트 리스너로 처리를 못한 에러가 발생하면 이벤트 리스너가 대신 실행되고 프로세스는 유지됨

```js
process.on("uncaughtException", (err) => {
  console.log("예상치 못한 에러", err);
});

setInterval(() => {
  throw new Error("에러 발생");
}, 1000);

setTimeout(() => {
  console.log("동작할까?");
}, 2000);

// 2초 후 콘솔 출력 됨
```

편한 것 같은데?
하지만 다음 동작이 제대로 작동하는지 보장이 되지 않으므로 공식 문서에서는 최후의 수단(as a last resort)으로 사용할 것을 주문하고 있었다.

## 마무리

책에서 **_서버 운영은 에러와의 싸움_**이라고 한 부분이 기억에 남았음!

- [ ] 배운 내용으로 프로젝트 2 에러 처리 리팩토링
- [ ] try-catch 남용에 따른 문제점은 없을까? 생각해보기
