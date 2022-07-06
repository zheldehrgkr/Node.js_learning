# Node Package Manager

## NPM

## package.json

생성

```bash
$ npm init
```

구조

```json
{
  "name": "practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js", // 실행 파일의 진입점
  "scripts": {
    // 명령어들
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "BDH",
  "license": "ISC"
}
```

패키지 설치

```bash
$ npm install express
```

```json
{
  "name": "practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "BDH",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1" // 설치한 패키지가 추가되었다.
  }
}
```

## node_modules 와 package-lock.json

- node_modules : 설치한 패키지가 의존하는 패키지들이 들어있다.
- package-lock.json : 설피한 패키지와 node_modules의 패키지들의 버젼과 의존성이 들어있다.

결국 package.json 만 있다면 만들 수 있으므로 중요한 것은 package.json!

## 설치 옵션

### 개발용 패키지 설치

```bash
$ npm install --save-dev nodemon
```

개발에만 필요한 패키지라면 위 명령어로 devDependencies에 따로 기록이 가능하다

```json
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "express": "^4.18.1",
    "express-session": "^1.17.3",
    "morgan": "^1.10.0"
  },
  "devDependencies": { // 따로 추가되었다.
    "nodemon": "^2.0.19"
  }
```

### 전역 설치

```bash
$ sudo npm install --global rimraf
```

위와 같은 명령어로 패키지를 node_modulesrk가 아닌 npm 설치 경로에 설치하여 콘솔 명령어로 사용가능하다.

### npx

위처럼 패키지를 전역 설치하게 되면 package.json에 추가되지 않기 때문에 다시 설치할 때 불편함이 생긴다.  
이를 해결하기 위한 명령어가 npx, 이걸 사용하면 package.json에 추가하고도 콘솔 명령어로 사용을 할 수 있다.

```bash
$ npm install --save-dev 패키지 이름
$ npx 패키지 이름 node_modules
```

## 기타 명령어 & npm에 패키지 배포

## 느낀 점
