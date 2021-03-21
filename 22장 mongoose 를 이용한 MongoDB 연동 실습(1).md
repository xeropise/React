# 22장 mongoose 를 이용한 MongoDB 연동 실습.md

## 22.1 소개하기

- 서버를 개발할 때 데이터베이스를 사용하면 RDBS(관계형 데이터베이스)를 자주 사용했는데 한계가 있다.

  - 첫 번째는 데이터 스키마가 고정적이다. 새로 등록하는 데이터 형식이 기존에 있던 데이터들과 다르다면, 기존 데이터를 모두 수정해야 새 데이터를 등록할 수 있다.

  - 두 번째는 확장성이다. RDBMS 는 저장하고 처리해야 할 데이터양이 늘어나면 여러 컴퓨터에 분산시키는 것이 아니라, 해당 데이터베이스 서버의 성능을 업그레이드 하는 방식으로 확장해 주어야 했다.

  - MongoDB 는 이런 한계를 극복한 문서 지향적 NoSQL 데이터베이스이다. 데이터베이스에 등록하는 데이터들은 유동적인 스키마를 지닐 수 있는데 종류가 같은 데이터라고 하더라도, 새로 등록해야 할 데이터 형식이 바뀐다고 하더라도 기존 데이터까지 수정할 필요는 없다. 서버의 데이터양이 늘어나도 한 컴퓨터에서만 처리하는 것이 아니라 여러 컴퓨터로 분산하여 처리할 수 있도록 확장하기 쉽게 설계되어 있다.

  - MongoDB 가 무조건 기존의 RDBMS 보다 좋은 것은 아니다. 상황 별로 적합한 데이터베이스가 다를 수 있다.

    - 데이터의 구조가 자주 바뀐다면 MongoDB 가 유리

    - 까다로운 조건으로 데이터를 필터링 해야 하거나, ACID 특성을 지켜야 한다면 RDMBS 가 더 유리

- RDBMS 는 설정해야 할 것도 많고, 배워야할 것도 많으므로 이 책에서는 조금만 배워도 유용한 MongoDB 를 사용함

---

### 22.1.1 문서란?

- 여기서 말하는 문서(document) 는 RDBMS 의 레코드(record) 와 개념이 비슷하다. 문서의 데이터 구조는 한 개 이상의 키-값 쌍으로 되어 있다.

```javascript
{
    "_id": ObjectId("5099803df3f4948bd2f98391"),
    "username": "velopert",
    "name": { first: "M.J.", last: "Kim" }
}
```

- 문서는 BSON(바이너리 형태의 JSON) 형태로 저장되는데, 나중에 JSON 형태의 객체를 데이터베이스에 저장할 때, 큰 공수를 들이지 않고도 데이터를 데이터베이스에 등록할 수 있어 매우 편하다.

- 새로운 문서를 만들면 \_id 라는 고윳값을 자동으로 생성하는데, 이 값은 시간, 머신 아이디, 프로세스 아이디, 순차 번호로 되어 있어 값의 고유함을 보장한다.

- 여러 문서가 들어 있는 곳을 컬렉션이라고 하는데 기존 RDBMS 에서는 테이블 개념을 사용하므로 각 테이블마다 같은 스키마를 가지고 있어야 한다. 새로 등록해야 할 데이터가 다른 스키마를 가지고 있다면, 기존 데이터들의 스키마도 모두 바꾸어 주어야 한다.

- 반면 MongoDB 는 다른 스키마를 가지고 있는 문서들이 한 컬렉션에서 공존할 수 있다.

```javascript
{
    "_id": ObjectId("5099803df3f4948bd2f98391"),
    "username": "velopert"
},
{
    "_id": ObjectId("5099803df3f4948bd2f98391"),
    "username": "velopert",
    "phone": "010-1234-1234"
}
```

> 컬렉션 안의 데이터가 같은 스키마를 가질 필요가 없다.

---

### 22.1.2 MongoDB 구조

- MongoDB 구조는 다음과 같다. 서버 하나에 데이터베이스를 여러 개 가지고 있을 수 있다. 각 데이터베이스에는 여러 개의 컬렉션이 있으며, 컬렉션 내부에는 문서들이 들어 있다.

![639](https://user-images.githubusercontent.com/50399804/111903153-279f4e80-8a84-11eb-988a-40f72ba8999a.jpg)

---

### 22.1.3 스키마 디자인

- MongoDB 에서 스키마를 디자인하는 방식은 기존 RDBMS 에서 스키마를 디자인하는 방식과 완전히 다르다. RDBMS에서 블로그용 데이터 스키마를 설계한다면 각 포스트, 댓글마다 테이블을 만들어 필요에 따라 JOIN 해서 사용하는 것이 일반적이다.

- 하지만 NoSQL 에서는 그냥 모든 것을 문서 하나에 넣는다.

```javascript
{
    _id: ObjectId,
    title: String,
    body: String,
    username: String,
    createDate: Date,
    comments: [
        {
            _id: ObjectId,
            text: String,
            createDate: Date,
        },
    ],
};
```

> 문서 내부에 또 다른 문서가 위치할 수 있는, 이를 서브 다큐먼트(subdocument) 라고 한다. 서브 다큐먼트 또한 일반 문서를 다루는 것처럼 쿼리할 수 있다.

- 문서 하나에 최대 16MB 만큼 데이터를 넣을 수 있는데, 100자 댓글 데이터라면 대략 0.24KB 를 차지한다. 16MB는 16,384KB 이니 문서 하나에 댓글 데이터를 약 68,000 개 넣을 수 있따.

- 서브 다큐먼트에서 이 용량을 초과할 가능성이 있다면 컬렉션을 분리시키는 것이 좋다.

---

## 22.2 MongoDB 서버 준비

- 생략, 책 참조

---

## 22.3 mongoose의 설치 및 적용

- mongoose 는 Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modeling) 라이브러리 이다. 데이터베이스 문서들을 자바스크립트 객체처럼 사용할 수 있게 해 준다.

- 22장에서 만든 백엔드 프로젝트를 이어서 진행해 보자. 프로젝트 디렉터리에서 다음 명령어를 입력하여 mongoose 와 dotenv 를 설치하자.

```
$ yarn add mongoose dotenv
```

- dotenv 는 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구, mongoose 를 사용하여 MongoDB 에 접속할 때, 서버에 주소나 계정 및 비밀번호가 필요한 경우가 있다. 이렇게 민감하거나 환경별로 달라질 수 있는 값은 코드 안에 직접 작성하지 않고, 환경변수로 설정하느 ㄴ것이 좋다.

- 프로젝트를 깃허브, 깃랩 등의 서비스에 올릴 때는 .gitignore 를 작성하여 환경변수가 들어 있는 파일은 제외시켜 주어야 한다.

---

### 22.3.1 .env 환경변수 파일 생성

- 환경변수에는 서버에서 사용할 포트와 MongoDB 주소를 넣어 주겠다. 프로젝트의 루트 경로에 .env 파일을 만들고 다음 내용을 입력하자.

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/blog
```

> blog 는 사용할 데이터베이스의 이름이다. 지정한 데이터베이스가 서버에 없다면 자동으로 만들어 주므로 사전에 직접 생성할 필요가 없다.

- src/index.js 파일의 맨 위에 다음과 같이 dotenv 를 불러와서 config() 함수를 호출하자. Node.js 환경변수는 process.env 값을 통해 조회할 수 있다.

_src/index.js_

```javascript
require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT } = process.env;

const api = require("./api");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use("/api", api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listening to port %d", port);
});
```

> .env 파일에서 PORT를 4001로 변경한 뒤 서버를 재시작 하자. .env 파일을 변경할 때는 nodemon 에서 자동으로 재시작하지 않으므로 직접 재시작해야 한다.

---

### 22.3.2 mongoose 로 서버와 데이터베이스 연결

- 이제 mongoose 를 이용하여 서버와 데이터베이스를 연결하자. 연결할 때는 mongoose 의 connect 함수를 사용하자.

_src/index.js_

```javascript
require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

const api = require('./api');

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

(...)

```

```
Listening to port 4001
Connected to MongoDB
```

> 다음 문구가 출력되면 데이터베이스에 성공적으로 연결된 것이다.

---

## 22.4 esm 으로 ES 모듈 import/export 문법 사용하기

- 기존 리액트 프로젝트에서 사용해 오던 ES 모듈 import/export 문법은 Node.js 에서 아직 정식으로 지원되지 않는다. Node.js 에 해당 기능이 구현되어 있기는 하지만 아직 실험적인 단계이기 때문에, 기본 옵션으로는 사용할 수 없으며, 확장자를 .mjs로 사용하고 node를 실행할 때 **--experimental-modules** 라는 옵션을 넣어 주어야 한다.

- Node.js 에서 import/export 문법을 꼭 사용해야 할 필요는 없지만, 이 문법을 사용하면 VSCode 에서 자동 완성을 통해 모듈을 자동으로 쉽게 불러올 수 있고 코드도 더욱 깔끔해 진다. 그러므로 esm 이라는 라이브러리의 도움을 받아 해당 문법을 사용해 보자.

> Node.js v12부터 ES Module 정식 지원

```
Node.js v12 를 사용할 경우, package.json 에 다음 줄을 추가하면 ES Module 을 바로 사용할 수 있다.

"scripts": {
    "start: "node src",
    "start:dev": "nodemon --watch src/ src/index.js"
},
"type": "module"

하단에 main.js 를 생성하는 내용이 나오는데, 그 부분을 생략하고 바로 2.2.4.1 절로 넘어가면 된다. 책에서 main.js 를 수정할 때, index.js 를 수정해라.
```

- 먼저 esm 을 yarn 으로 설치하자.

```
$ yarn add esm
```

- src_index.js 파일의 이름을 main.js 로 변경하고, index.js 파일을 새로 생성해서 다음 코드를 작성하자.

_src/index.js_

```javascript
// 이 파일에서만 no-global-assign ESLint 옵션을 비활성화한다.
/* eslint-disable no-global-assign */

require = require("esm")(module /*, options*/);
module.exports = require("./main.js");
```

- 다음으로 package.json 에서 만들었던 스크립트를 조금 수정하자.

_package.json - scripts_

```json
  "scripts": {
    "start": "node src -r esm src",
    "start:dev": "nodemon --watch src/ -r esm src/index.js"
  }
```

- ESLint 에서 import/export 구문을 사용해도 오류로 간주하지 않도록 다음과 같이 .eslintrc.json 에서 sourceType 값을 "module" 로 설정해 주자.

_.eslintrc.json_

```json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

- 이제 프로젝트에서 import/export 구문을 자유롭게 사용할 수 있다. 이전에 만들었던 모듈을 하나하나 수정하자.

---

### 22.4.1 기존 코드 ES Moduel 형태로 바꾸기

- api/posts/posts.ctrl.js 파일을 열어서 exports 코드를 export const로 모두 변환하자.

_porsts.ctrl.js_

```javascript

(...)

/* 포스트 작성
POST /api/posts
{ title, body }
*/
export const write = (ctx) => {
  (...)
};

/* 포스트 목록 조회
GET /api/posts
*/
export const list = (ctx) => {
  (...)
};

/* 특정 포스트 조회
GET /api/posts/:id
*/
export const read = (ctx) => {
  (...)
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
export const remove = (ctx) => {
  (...)
};

/* 포스트 수정(교체)
PUT /api/posts/:id
{ title, body }
*/
export const replace = (ctx) => {
  (...)
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
export const update = (ctx) => {
  (...)
};

```

- 다음으로 src/api/posts/index.js 파일을 수정하자.

_src/api/posts/index.js_

```javascript
import Router from "koa-router";
import * as postsCtrl from "./posts.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);
posts.get("/:id", postsCtrl.read);
posts.delete("/:id", postsCtrl.remove);
posts.put("/:id", postsCtrl.replace);
posts.patch("/:id", postsCtrl.update);

export default posts;
```

_src/api/index.js_

```javascript
import Router from "koa-router";
import posts from "./posts";

const api = new Router();

api.use("/posts", posts.routes());

// 라우터를 내보낸다.
export default api;
```

_src/main.js_

```javascript
require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

(...)
```

- Postman 으로 http://localhost:4001/api/posts 에 요청을 보내 서버가 오류 발생으로 종료되지 않고 잘 작동하는지 확인해 보자.

- 코드를 모두 작성하고 확인도 했으면, 프로젝트 루트 디렉터리에 _jsconfig.json_ 을 작성하자.

_jsconfig.json_

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es2015"
  },
  "include": ["src/**/*"]
}
```

- 위 파일을 작성해 주면 나중에 자동 완성을 통해 모듈을 불러올 수 있다. src 디렉터리에 sample.js 라는 파일을 작성하고, api 를 입력했을 때 자동 완성할 수 있는 인텔리센스 창이 뜨는지 확인해 보자. 확인 후 삭제하자.
