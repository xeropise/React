### 21.5.3 REST API

- 웹 애플리케이션을 만들려면 데이터베이스에 정보를 입력하고 읽어 와야 한다. 그런데 웹 브라우저에서 데이터베이스에 직접 접속하여, 데이터를 변경하면 보안상 문제가 되므로, REST API를 만들어서 사용하자.

- REST API 는 요청 종류에 따라 다른 HTTP 메서드를 사용하는데, 다음과 같다.

| 메서드 | 설명                                                          |
| ------ | ------------------------------------------------------------- |
| GET    | 데이터를 조회할 때 사용                                       |
| POST   | 데이터를 등록할 때 사용, 인증 작업을 거칠 떄 사용하기도 한다. |
| DELETE | 데이터를 지울 때 사용                                         |
| PUT    | 데이터를 새 정보로 통째로 교체할 때 사용                      |
| PATCH  | 데이터의 특정 필드를 수정할 때 사용                           |

- REST API를 설계할 때는 API 주소와 메서드에 따라 어떤 역할을 하는지 쉽게 파악할 수 있도록 작성해야 한다. 블로그 포스트용 REST API를 예시로 살펴보면 다음과 같다.

| 종류                                  | 기능                                                      |
| ------------------------------------- | --------------------------------------------------------- |
| POST /posts                           | 포스트 작성                                               |
| GET /posts                            | 포스트 목록 조회                                          |
| GET /posts/:id                        | 특정 포스트 조회                                          |
| DELETE /posts/:id                     | 특정 포스트 삭제                                          |
| PATCH /posts/:id                      | 특정 포스트 업데이트(구현 방식에 따라 PUT으로도 사용 가능 |
| POST /posts/:id/comments              | 특정 포스트에 덧글 등록                                   |
| GET /posts/:id/comments               | 특정 포스트의 덧글 목록 조회                              |
| DELETE /posts/:id/comments/:commendId | 특정 포스트의 덧글 삭제                                   |

---

### 21.5.2 라우트 모듈화

- 프로젝트를 진행하다 보면 여러 종류의 라우트를 만들게 된다. 하지만 각 라우트를 index.js 파일 하나에 모두 작성하면, 코드가 너무 길어질 뿐 아니라 유지 보수하기도 힘들어진다. 여기서는 라우터를 여러 파일에 분리시켜서 작성하고, 이를 불러와 적용하는 방법을 알아보자.

- src 디렉터리에 api 디렉터리를 생성하고, 그 안에 index.js 파일을 만들자.

_src/api/index.js_

```javascript
const Router = require("koa-router");
const api = new Router();

api.get("/text", (ctx) => {
  ctx.body = "test 성공";
});

// 라우터를 내보낸다.
module.exports = api;
```

- 그 다음에는 이 api 라우트를 src/index.js 파일에 불러와서 기존 라우터에 /api 경로로 적용하자. 기존에 만들었던 라우트는 제거하자.

_srx/index.js_

```javascript
const Koa = require("koa");
const Router = require("koa-router");

const api = require("./api");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use("/api", api.routes()); // api 라우트 적용

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

- http://localhost:4000/api/test 를 웹브라우저에 띄워서 제대로 동작하는지 확인하자.

---

### 21.5.5 posts 라우트 생성

- 이번에는 api 라우트 내부에 posts 라우트를 만들어 보자. api 디렉터리에 posts 디렉터리를 만들고, 그 내부에 index.js 파일을 만들자.

_src/api/posts/index.js_

```javascript
const Router = require("koa-router");
const posts = new Router();

const printInfo = (ctx) => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

posts.get("/", printInfo);
posts.post("/", printInfo);
posts.get("/:id", printInfo);
posts.delete("/:id", printInfo);
posts.put("/:id", printInfo);
posts.patch("/:id", printInfo);
module.exports = posts;
```

- posts 라우트에 여러 종류의 라우트를 설정한 후, 모두 printInfo 함수를 호출하도록 설정했다. 문자열이 아닌 json 객체를 반환하도록 설정하고, 이 객체에는 현재 요청의 메서드 경로, 파라미터를 담았다.

- 코드를 완성한 후, api 라우트에 posts 라우트를 연결하자. 연결하는 방법은 서버의 메인 파일에 api 라우트를 적용하는 방법과 비슷하다.

_src/api/index.js_

```javascript
const Router = require("koa-router");
const posts = require("./posts");

const api = new Router();

api.use("/posts", posts.routes());

// 라우터를 내보낸다.
module.exports = api;
```

- 기존 test 라우트는 지우고, posts 라우트를 불러와서 설정해 주었다. 우선 GET /api/posts 라우트부터 테스트해 보자. http://localhost:4000/api/posts 를 웹브라우저로 띄워보자.

```json
// http://localhost:4000/api/posts

{
  "method": "GET",
  "path": "/api/posts",
  "params": {}
}
```

- 이제 나머지 API도 테스팅해 볼 텐데, GET 메서드를 사용하는 API 웹 브라우저에서 주소를 입력하여 테스팅할 수 있지만, POST, DELETE, PUT, PATCH 메서드를 사용하는 API는 자바스크립트를 호출해야 한다.

- Postman 이라는 프로그램을 설치해서 사용해 보자. 설치 과정은 생략, 테스트도 생략

---

#### 21.5.5.2 컨트롤러 파일 작성

- 라우트를 작성하는 과정에서 특정 경로에 미들웨어를 등록할 때는 다음과 같이 두 번째 인자에 함수를 선언해서 바로 넣어 줄 수 있다.

```javascript
router.get("/", (ctx) => {});
```

- 각 라우트 처리 함수의 코드가 길면 라우터 설정을 한눈에 보기 힘드므로, 라우트 처리 함수들은 다른 파일로 따로 분리해서 관리할 수도 있다. 라우트 처리 함수만 모아 놓은 파일을 컨트롤러라고 한다.

- 아직 데이터베이스를 연결하지 않았으므로 자바스크립트의 배열 기능만 사용하여 임시로 기능을 구현해 보자.

- API 기능을 본격적으로 구현하기 전에 먼저 koa-bodyparser 미들웨어를 적용해야 한다. 이 미들웨어는 POST/PUT/PATCH 같은 메서드의 Request Body에 JSON 형식으로 데이터를 넣어 주면, 이를 파싱하여 서버에서 사용할 수 있게 한다.

```
$ yarn add koa-bodyparser
```

- 미들웨어를 불러와 적용하자. 이때 주의할 점은 router 를 적용하는 코드의 웃부분에서 해야 한다는 것이다.

_src/index.js_

```javascript
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const api = require("./api");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use("/api", api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
```

- posts 경로에 posts.ctrl.js 파일을 만든 후, 주석을 참고하면서 다음 코드를 입력해 보자.

_src/api/posts/posts.ctrl.js_

```javascript
let postId = 1; // id의 초깃값입니다.

// posts 배열 초기 데이터
const posts = [
  {
    id: 1,
    title: "제목",
    body: "내용",
  },
];

/* 포스트 작성
POST /api/posts
{ title, body }
*/
exports.write = (ctx) => {
  // REST API의 request body는 ctx.request.body에서 조회할 수 있습니다.
  const { title, body } = ctx.request.body;
  postId += 1; // 기존 postId 값에 1을 더합니다.
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

/* 포스트 목록 조회
GET /api/posts
*/
exports.list = (ctx) => {
  ctx.body = posts;
};

/* 특정 포스트 조회
GET /api/posts/:id
*/
exports.read = (ctx) => {
  const { id } = ctx.params;
  // 주어진 id 값으로 포스트를 찾습니다.
  // 파라미터로 받아 온 값은 문자열 형식이니 파라미터를 숫자로 변환하거나,
  // 비교할 p.id 값을 문자열로 변경해야 합니다.
  const post = posts.find((p) => p.id.toString() === id);
  // 포스트가 없으면 오류를 반환합니다.
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  ctx.body = post;
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
exports.remove = (ctx) => {
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  // index번째 아이템을 제거합니다.
  posts.splice(index, 1);
  ctx.status = 204; // No Content
};

/* 포스트 수정(교체)
PUT /api/posts/:id
{ title, body }
*/
exports.replace = (ctx) => {
  // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다.
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  // 전체 객체를 덮어씌웁니다.
  // 따라서 id를 제외한 기존 정보를 날리고, 객체를 새로 만듭니다.
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
exports.update = (ctx) => {
  // PATCH 메서드는 주어진 필드만 교체합니다.
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  // 기존 값에 정보를 덮어씌웁니다.
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
```

- 컨트롤러를 만들어 exports.이름 = ... 형식 으로 함수를 내보내 주었다. 이렇게 내보낸 코드는 다음 형식으로 불러올 수 있다.

```javascript
const 모듈이름 = require("파일이름");
모듈이름.이름();
```

- require('./posts.ctrl') 을 입력하여 방금 만든 posts.ctrl.js 파일을 불러온다면 다음 객체를 불러오게 된다.

```javascript
{
    write: Function,
    list: Function,
    read: Function,
    remove: Function,
    replace: Function,
    update: Function
};
```

컨트롤러 함수들을 한번 각 라우트에 연결해 보자.

_src/api/posts/index.js_

```javascript
const Router = require("koa-router");
const postsCtrl = require("./posts.ctrl");

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);
posts.get("/:id", postsCtrl.read);
posts.delete("/:id", postsCtrl.remove);
posts.put("/:id", postsCtrl.replace);
posts.patch("/:id", postsCtrl.update);

module.exports = posts;
```

- 이제 posts 라우터가 완성되었다. Postman 으로 테스트를 해 보자. list, read, remove 를 제외한 API들은 요청할 때 Request Body 가 필요한데, 이 값을 Postman 에서 method (POST) 를 선택하고, Body 부분이 활성화된다. (raw 옵션을 클릭하고 주황색으로 나타네는 데이터 타입을 JSON 으로 설정하자.)

- 테스트 과정은 책 참조, 구현한 update 와 replace 함수는 용도는 비슷하지만 구현 방식은 다르다. update(PATCH) 는 기존 값은 유지하면서 새 값을 덮어 씌우는 반면, replace(PUT) 은 Request Body 로 받은 값이 id를 제외한 모든 값을 대체한다. 직접 한번 호출해 보자. (책 참조)

---

## 21.6 정리

- Koa 를 사용하여 백엔드 서버를 만드는 기본 개념에 대해 알아 보았다. 먼저 REST API를 살펴본 후, 어떻게 작동하는지를 자바스크립트 배열을 사용하여 구현하면 알아 보았다. 자바스크립트 배열을 사용하여 구현하면 서버를 재시작할 때, 당연히 데이터가 소멸된다. 이 데이터를 로컬 파일에 저장하는 방법도 있지만, 실제 프로젝트에서는 권장하지 않으므로, 데이터베이스에 정보를 저장하여 관리한다.

- 다음 장에서 몽고디비를 사용하여 백엔드를 구현해 보자.
