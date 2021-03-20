## 21.3 Koa 기본 사용법

### 21.3.1 서버 띄우기

- 먼저 서버를 여는 방법부터 알아 보자. index.js 파일에 작성한 코드를 지우고, 다음 코드를 입력하자.

_src/index.js_

```javascript
const Koa = require("koa");

const app = new Koa();

app.use((ctx) => {
  ctx.body = "hello world";
});

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

- 서버를 실행해 보자. http://localhost:4000/ 에 접속해 보자.

```
$ node src
```

> index.js 생략됨, blog-backend 위치에서 실행

---

### 21.3.2 미들웨어

- Koa 애플리케이션은 미들웨어의 배열로 구성되어 있다. 조금 전 코드에서 app.use 함수를 사용했는데, 이 함수는 미들웨어 함수를 애플리케이션에 등록한다.

- 미들웨어 함수는 다음과 같은 구조로 이루어져 있다.

```javascript
(ctx, next) => {};
```

- Koa의 미들웨어 함수는 두 개의 파라미터를 받는데, 첫 번째 파라미터는 ctx 라는 값이고, 두 번째 파라미터는 next 이다

- ctx 는 Context 의 줄임말로 웹 요청과 응답에 관한 정보를 지니고 있다. next 는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수이다. 미들웨어를 등록하고 next 함수를 호출하지 않으면, 그 다음 미들웨어를 처리하지 않는다.

- 만약 미들웨어에서 next 를 사용하지 않으면 ctx => {} 와 같은 형태로 파라미터에 next 를 설정하지 않아도 괜찮다. 다음 미들웨어를 처리할 필요가 없는 라우트 미들웨어를 나중에 설정할 때 이러한 구조로 next 를 생략하여 미들웨어를 작성한다.

- 미들웨어는 **app.use 를 사용하여 등록되는 순서대로 처리된다.** 다음과 같이 현재 요청을 받은 주소와 우리가 정해 준 숫자를 기록하는 두 개의 미들웨어를 작성해 보자.

_src/index.js_

```javascript
const Koa = require("koa");

const app = new Koa();

app.use((ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  next();
});

app.use((ctx, next) => {
  console.log(2);
  next();
});
app.use((ctx) => {
  ctx.body = "hello world";
});

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

> 서버를 종료 한뒤, 명령어를 재실행한 후 접속해 보자.

- 크롬 브라우저는 사용자가 웹 페이지에 들어가면 해당 사이트의 아이콘 파일인 /favicon.ico 파일을 서버에 요청하기 때문에 결과에 / 경로도 나타나고 /favicon.ico 경로도 나타난다.

- 이번엔 첫 번째 미들웨어에서 호출하던 next 함수를 주석으로 처리해 보자.

_src/index.js_

```javascript
(...)

app.use((ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  //next();
});

(...)
```

> 재실행해보자.

- 이번엔 next 를 호출하지 않으니, 첫 번째 미들웨어까지만 실행하고, 그 아래에 있는 미들웨어는 모두 무시되었다. 이런 속성을 사용하면 조건부로 다음 미들웨어 처리를 무시하게 만들 수 있는데, 다음과 같이 해보자.

_src/index.js_

```javascript
(...)

app.use((ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authroized !== '1') {
    ctx.status = 401; // Unauthroized
    return;
  }
  next();
});

(...)
```

> 쿼리 파라미터는 문자열이기 때문에 비교할 때는 꼭 문자열 형태로 비교해야 한다.

```
http://localhost:4000/
http://localhost:4000/?authorized=1
```

> 결과가 다름을 알 수 있다.

- 지금은 단순히 주소의 쿼리 파라미터를 사용하여 조건부로 처리했지만, 나중에는 웹 요청의 쿠키 혹은 헤더를 통해 처리할 수도 있다.

#### 21.3.2.1 next 함수는 Promise 를 반환

- next 함수를 호출하면 Promise 를 반환한다. Koa가 Express 와 차별화되는 부분이다. next 함수가 반환하는 Promise는 다음에 처리해야 할 미들웨어가 끝나면 완료된다. 다음과 같이 next 함수 호출 이후에 then 을 사용하여 Promise 가 끝난 다음 콘솔에 END 를 기록하도록 수정해 보자.

_src/index.js_

```javascript
(...)

app.use((ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authroized !== '1') {
    ctx.status = 401; // Unauthroized
    return;
  }
  next().then(() => {
    console.log('END');
  });
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use((ctx) => {
  ctx.body = 'hello world';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});

```

> 서버를 재시작한 뒤, http://localhost:4000/?authorized=1 에 접속해 보자.

```
Listening to port 4000
/?authroized=1
1
2
END
```

- END가 잘 나타난 것을 확인할 수 있다. 브라우저 버전에 따라 /favicon.ico 를 요청하지 않을 수도 있는데, 나타나지 않아도 괜찮으니 신경쓰지 말자

---

#### 21.3.2.2 async/await 사용하기

- Koa 는 async/await 를 정식으로 지원하기 떄문에 해당 문법을 아주 편하게 사용할 수 있다.

> 서버 사이드 렌더링을 할 때 사용했던 Express 도 async/await 문법을 사용할 수 있지만, 오류를 처리하는 부분이 제대로 작동하지 않을 수 있다. 백엔드 개발을 하면서 예상치 못한 에러를 제대로 잡아내려면 express-async-errors 라는 라이브러리를 따로 사용해야 한다.

- 기존 코드를 async/await 를 사용하는 형태로 수정해 보자.\_

_src/index.js_

```javascript
(...)

app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authroized !== '1') {
    ctx.status = 401; // Unauthroized
    return;
  }
  await next();
  console.log('END');
});

(...)
```

> 수정하고 다시 접속해 보자. http://localhost:4000/?authroized=1

---

## 21.4 nodemon 사용하기

- 서버 코드를 변경할 때마다 서버를 재시작하는 것은 꽤 번거롭다. nodemon 이라는 도구를 사용하면 코드를 변경할 때마다 서버를 자동으로 재시작한다. 개발용 의존 모듈로 설치하자.

```
$ yarn add -D nodemon
```

- 그 다음, package.json 에 scripts 를 다음과 같이 입력하자.

_package.json_

```json
{
  "name": "blog-backend",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "eslint-config-prettier": "^8.1.0",
    "koa": "^2.13.1"
  },
  "devDependencies": {
    "eslint": "^7.22.0",
    "nodemon": "^2.0.7"
  },
  "scripts": {
    "start": "node src",
    "start:dev": "nodemon --watch src/ src/index.js"
  }
}
```

> 여기서 nodemon 은 src 디렉터리를 주시하고 있다가, 해당 디렉터리 내부의 어떤 파일이 변경되면, 이를 감지하여 src/index.js 파일을 재시작해 준다.

- 기존에 실행 중이던 서버를 종료한 뒤 yarn start:dev 명령어를 실행하자. 그 다음에 index.js 에서 기존 미들웨어를 모두 제거하자.

_src/index.js_

```javascript
const Koa = require("koa");

const app = new Koa();

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

```
$ nodemon --watch src/ src/index.js
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/index.js`
Listening to port 4000
[nodemon] restarting due to changes...
[nodemon] starting `node src/index.js`
Listening to port 4000
```

> 이제 매번 서버를 수동으로 재시작하는 번거로움이 없다.

---

## 21.5 koa-router 사용하기

- 앞에서 리액트를 배울 때 웹 브라우저의 라우팅을 돕는 리액트 라우터 라이브러리를 사용해 보았는데, Koa 를 사용할 때도 다른 주소로 요청이 들어올 경우, 다른 작업을 처리할 수 있도록 라우터를 사용해야 한다. Koa 자체에 이 기능이 내장되어 있지 않으므로, koa-router 모듈을 설치해야 한다.

```
$ yarn add koa-router
```

### 21.5.1 기본 사용법

- index.js 에서 라우터를 불러와 적용하는 방법을 알아보자.

_src/index.js_

```javascript
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.get("/", (ctx) => {
  ctx.body = "홈";
});

router.get("/about", (ctx) => {
  ctx.body = "소개";
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

- koa-router 를 불러온 뒤, 이를 사용하여 Router 인스턴스를 만들었다. 그리고 / 경로로 들어오면 '홈'을 띄우고, /about 경로로 들어오면 '소개' 텍스트가 나타나도록 설정했다.

- 이처럼 라우트를 설정할 때, router.get 의 첫 번째 파라미터에는 라우트의 경로를 넣고, 두 번쨰 파라미터에는 해당 라우터에 적용할 미들웨어 함수를 넣는다.

- 여기서 get 키워드는 해당 라우트에서 사용할 HTTP 메서드를 의미하며, get 대신에 post, put, delete 등을 넣을 수 있다. 이는 좀 뒤에 자세히 알아보자.

- 코드를 저장하고 http://localhost:4000/ 과 http://localhost:4000/about 페이지에 들어가 보자.

---

### 21.5.2 라우트 파라미터와 쿼리

- 라우트의 파라미터와 쿼리를 읽는 방법을 알아보자. 라우터의 파라미터를 설정할 때는 /about/:name 형식으로 콜론(:)을 사용하여 라우트 경로를 설정한다. 리액트 라우터에서 설정했을 때와 꽤 비슷하다.

- 파라미터가 있을 수도 있고 없을 수도 있다면 /about/:name? 같은 형식으로 파라미터 이름 뒤에 물음표를 사용한다. 이렇게 설정한 파라미터는 함수의 ctx.params 객체에서 조회할 수 있다.

- URL 쿼리의 경우, 예를 들어 /posts/?id=10 같은 형식으로 요청했다면 해당 값을 ctx.query 에서 조회할 수 있다. 쿼리 문자열을 자동으로 객체 형태로 파싱해 주므로 별도로 파싱 함수를 돌릴 필요가 없다. (문자열 형태의 쿼리 문자열을 조회해야 할 때는 ctx.querystring 을 사용한다.)

- 파라미터와 쿼리를 사용하는 라우트를 다음과 같이 만들어 보자.

_srx/index.js_

```javascript
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.get("/", (ctx) => {
  ctx.body = "홈";
});

router.get("/about/:name?", (ctx) => {
  const { name } = ctx.params;
  // name의 존재 유무에 따라 다른 결과 출력
  ctx.body = name ? `${name}의 소개` : "소개";
});

router.get("/posts", (ctx) => {
  const { id } = ctx.query;
  // id으 ㅣ존재 유무에 따라 다른 결과 출력
  ctx.body = id ? `포스트 #${id}` : "포스트 아이디가 없습니다.";
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

- 파라미터와 쿼리는 둘 다 주소를 통해 특정 값을 받아올 때 사용하지만, 용도가 서로 조금씩 다르다. 정해진 규칙은 따로 없지만, 일반적으로 파라미터는 처리할 작업의 카테고리를 받아 오거나, 고유 ID 혹은 이름으로 특정 데이터를 조회할 때 사용한다.

- 반면, 쿼리는 옵션에 관련된 정보를 받아온다. 예를 들면 여러 항목을 리스팅하는 API라면, 어떤 조건을 만족하는 항목을 보여 줄지 또는 어떤 기준으로 정렬할지를 정해야 할 때 쿼리를 사용한다.
