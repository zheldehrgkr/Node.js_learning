# 관계형 데이터베이스

## 데이터베이스

데이터베이스(영어: database, DB)는 여러 사람이 공유하여 사용할 목적으로 체계화해 통합, 관리하는 데이터의 집합이다. - 위키피디아

### RDBMS

이러한 데이터베이스를 관리하는 시스템을 DBMS라고 한다.  
데이터베이스 중 열과 행으로 이루어진 테이블 형식으로 데이터를 저장하고, 행끼리 관계를 가질 수 있는 데이터베이스를 '관계형 데이터베이스'라 하고
이를 다루는 것이 RDBMS 되겠다.

Mysql은 많이 쓰이는 RDBMS 중 하나이다.

이 책에서는 DB 실습에 필요한 정도만 DB에 대해서 공부한다.

- [ ] DB 관련 이론에 대한 추가적인 학습

## 데이터베이스 조작

- [ ] 실습해 본 적이 있어서, DB 이론 정리하면서 다시 같이 보기

## 시퀄라이즈 시작하기

자바스크립트 객체와 db의 릴레이션을 매핑해주는 라이브러리이다.

js 코드를 sql로 바꾸어 주기 때문에 즉, js로 mysql을 조작할 수 있다.

```bash
$ npm init
$ npm i express sequelize sequelize-cli mysql2
// cli = 명령어 실행 패키지, mysql2 = mysql과 시퀄라이즈 연결하는 드라이버 라고 함
$ npx sequelize init
// 시퀄라이즈 시작하기
```

config, migrations, models, seeders라는 폴더가 추가 생성된다.

각 역할을 간단히 알아보면,

- config : 연동되는 DB의 정보가 들어있는 폴더이다.
- models : mysql의 테이블에 대응 되는 개념이다.
- migrations : 테이블 수정이나 스키마 변경시 사용한다.
- seeders : 더미 데이터를 넣을 수 있는 부분이다.

models 안에 index.js라는 파일이 있다. 기본 생성 코드는 그대로 쓰면 에러가 난다고 책에서 일부 코드 수정을 하라고 설명하였다.

구조를 보면 env는 config.js에서 어떤 db에 연결할 것인지를 정하는 것이고, config에 연결할 db의 정보가 들어있다.  
그래서 new Sequelize로 새로운 시퀄라이즈 생성을 한다... 뭐 이런 식인듯 하다.

```js
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize;

module.exports = db;
```

- [ ] 생성자 함수에 대해서 공부하기

## DB 연결하기

이제 app.js로 가서 express와 mysql을 연결해야 한다.  
sequelize **객체**를 import 해 오고 sync 메소드로 연결이 가능하다.

```js
const express = require("express");

const { sequelize } = require("./models");

const app = express();
app.set("port", process.env.PORT || 3000);

sequelize // db 연결!
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "포트에서 대기 중");
});
```

어디에 연결하는 것인지는 config.json에서 설정한다.  
연결 이전에 사용할 db를 먼저 준비해 두어야 한다.

```json
// config/config.json

{
  "development": {
    "username": "root",
    "password": "root의 mysql 접속 비밀번호",
    "database": "사용하려는 db 이름",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
...
```

### 환경 변수로 설정하기

책에는 없었지만 password 보안을 위해서 환경변수를 사용할 수 있다.  
dotenv를 설치하고 .env 파일 생성 후 환경변수를 설정, .gitignore에 .env 추가하고

```text
// .env

DB_PASSWORD=
```

config.json에서 파일명을 config.js로 바꾸어 주고 dotenv 임포트, 패스워드 부분을 환경변수로 바꾸어주면 된다.

```js
// config/config.js

require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "nodejs",
    host: "127.0.0.1",
    dialect: "mysql",
  },
...
};
```

마지막으로 models/index.js에서 config.json을 참고하고 있으므로 그 부분을 config.js로 변경

```js
// models/index.js

const config = require(__dirname + "/../config/config.js")[env];
```

## 모델 생성하기

이제 모델(테이블에 해당하는)을 만들자. models 폴더 밑에 파일을 만든다.  
구조는 대략 다음과 같다.

```js
const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      // 컬럼에 들어갈 내용
      {
        name: {
          type: Sequelize.STRING(20),
          allowNull: false, // NOT NULL 옵션
          unique: true, // UNIQUE 옵션
        },
      },
      // 중략...

      // 테이블에 관한 옵션 설정
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {} // 다른 모델과의 관계를 작성
};
```

그리고 models/index.js에 모듈 불러오고 연결해 주어야 한다.

```js
const Sequelize = require("sequelize");
const User = require("./user"); // 임포트

db.sequelize = sequelize;

// 이 부분 추가
db.User = User;

User.init(sequelize);

User.associate(db);
//
module.exports = db;
```

- [ ] js책 ch.25 클래스 공부하기

js 공부도 타이트하게 해 나가야 겠다. 패턴만 숙지해서 사용하는 것은 문제가 없으나 어떤 식으로 구조가 짜여있는 건지 이해가 가지 않는다.  
아니면 (어쨋든 클래스는 알아야 하지만) 여기서 굳이 구조까지 이해 할 필요가 없는 것일까... 잘 모르겠다.  
그리고 이 부분은 버젼 때문인지 es6 업데이트 때문인지 뭔지 방법도 여러가지가 있어가지고 설명 하는 곳마다 조금씩 달라서 프로젝트 할 때 머리가 아팠던 기억이 난다.

## 관계 정의하기

아까 정의한 users 테이블과 여기는 안 썼지만 comments 테이블이 있다고 하자.  
한 유저가 여러개의 코멘트를 작성할 수 있고, 한 댓글의 작성자는 한 명 뿐이므로 유저-코멘트는 1:N 관계이다. 이 관계를 시퀄라이즈 모델 내에서 정의하자.

제시된 구조는 대략 이런 식이었다. users 테이블의 id를 가져와서,
comments 테이블에서 코멘트를 남긴 해당 id를 'commenter'라는 이름의 컬럼으로 쓰기를 원했다.

작성은 모델 정의한 파일 제일 하단에 associate에서 설정 가능하다.  
패턴은 다음과 같다.

```js
// models/user.js
  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
  }
};

// models/comment.js
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: "commenter", targetKey: "id" });
  }
};
```

이 1:N 관계에서 1, 즉 참조가 되는 쪽은 hasmany 메소드를 사용해야 한다.  
연결할 외래키는 새롭게 만들 컬럼의 이름(또는 만들었다면 연결할 컬럼), 소스키는 참조되는 컬럼의 이름을 쓴다.  
N, 즉 참조 하는 쪽은 belongsTo 메소드를 사용한다. 외래키는 아까와 같고, 이번엔 타켓키로 아까와 같은 값을 적는다.

- [ ] 저 매개변수 db는 무엇을 가리키고 있는 것인가?

## id 말고 다른 컬럼 참조하기

- [ ] 찬찬히 정리해보기

## 쿼리 수행하기

모델도 만들어 놨고 관계도 정의해 놨으니 이제 쿼리로 데이터 조작을 할 시간이다.

...

이와 같이 시퀄라이즈로 db작업을 할 수 있으나, 모든 db 작업을 할 수는 없으므로 직접 sql을 다루어야 할 경우가 있어서 sql을 학습하기를 권고하고 있다.

## 마무리

물론 한 번 해본 것이라 그렇겠지만 이번 챕터 공부하면서 책이 아무래도 체계적이고 빠른 속도로 배울 수 있는 것 같다.  
개발 공부는 인터넷에 자료나 프로그램도 많고 구글링이 중요하다지만 이번에 이 책이랑 js 책을 읽으면서 느낀건데 처음 입문할 때는 역시 (잘 쓴)책이 제일 좋은 것 같다.

migraions와 seeders는 책에서는 다루고 있지 않았다. 프로젝트때 구글링 하면서 해보긴 했는데 공식문서도 왜인지 잘 안읽히고 개운치가 않다...
좀 더 명확하게 짚고 넘어갈 필요가 있겠다.

- [ ] migrate 기능에 대해서 숙지하기
- [ ] seeders 기능에 대해서 숙지하기
- [ ] 위 두 기능을 mysql에서 조작하려면 어떻게 해야할까?
