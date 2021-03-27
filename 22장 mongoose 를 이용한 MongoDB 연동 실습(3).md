## 22.9 요청 검증

---

### 22.9.1 ObjectId 검증

- 이번엔 요청을 검증하는 방법을 알아보자. 앞서 read API 를 실행할 때, id 가 올바른 ObjectId 형식이 아니면 500 오류가 발생했다. 500 오류는 보통 서버에서 처리하지 않아 내부적으로 문제가 생겼을 때 발생한다.

- 잘못된 id를 전달했다면 클라이언트가 요청을 잘못 보낸 것이니 400 Bad Request 오류를 띄워주는 것이 맞다. 그러려면 id 값이 올바른 ObjectId 인지 확인해야 하는데, 이를 검증하는 방법은 다음과 같다.

```javascript
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
ObjectId.isValid(id);
```

- 현재 ObjectId 를 검증해야 하는 API 는 read, remove, update 이렇게 세 가지이다. 모든 함수에서 이를 검증하기 위해 검증 코드를 각 함수 내부에 일일히 삽입하면 똑같은 코드가 중복되므로, 코드를 중복해 넣지 않고, 한 번만 구현한 다음 여러 라우트에 쉽게 적용하는 방법이 있다.

- 바로 미들웨어를 만드는 것이다. posts.ctrl.js 의 코드 상단에 미들웨어를 작성하자.

_src/api/posts/posts.ctrl.js_

```javascript
import Post from '../../models/post';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

(...)
```

- 그리고 src/api/posts/index.js 에서 ObjectId 검증이 필요한 부분에 방금 만든 미들웨어를 추가하자.

_src/api/posts/index.js_

```javascript
import Router from "koa-router";
import * as postsCtrl from "./posts.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);
posts.get("/:id", postsCtrl.checkObjectId, postsCtrl.read);
posts.delete("/:id", postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch("/:id", postsCtrl.checkObjectId, postsCtrl.update);

export default posts;
```

- 이걸 한 번 더 리팩토링하면 다음과 같이 정리할 수 있다.

_src/api/posts/index.js_

```javascript
import Router from "koa-router";
import * as postsCtrl from "./posts.ctrl";
import checkLoggedIn from "../../lib/checkLoggedIn";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get("/", postsCtrl.read);
post.delete("/", checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch("/", checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);
//여기 왜 s야... 수정필요
posts.use("/:id", postsCtrl.getPostById, post.routes());

export default posts;
```

---

### 22.9.2 Request Body 검증

- 이제 write, update API 에서 전달받은 요청 내용을 검증하는 방법을 알아보자. 포스트를 작성할 때는 서버는 title, body, tags 값을 모두 전달받아야 한다. 클라이언트가 값을 빼먹었을 때는 400 오류가 발생해야 한다. 지금은 따로 처리 하지 않았기 때문에 요청 내용을 비운 상태에서 write API 를 실행해도 요청이 성공하여 비어 있는 포스트가 등록된다.

- 객체를 검증하기 위해 각 값을 IF 문으로 비교하는 방법도 있지만, 여기서는 이를 수월하게 해 주는 라이브러리인 Joi(https://github.com/hapijs/joi) 를 설치하여 사용하겠다.

- yarn 으로 Joi 를 설치하자.

```
$ yarn add joi
```

- write 함수에서 Joi 를 사용하여 요청 내용을 검증해 보자.

_src/api/posts/posts.ctrl.js_

```javascript
import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required() 가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

- write API 를 호출할 때 Request Body 에 필요한 필드가 빠져 있다면 400 오류를 응답하게 되는데, 응답 내용에 에러를 함꼐 반환한다. 직접 tags 배열을 제외하고 API 요청을 한번 해 보자.

```javascript
POST http://localhost:4001/api/posts
{
    "title": "제목",
    "body": "내용"
}
```

- write API 를 수정 한 뒤에 update API 의 경우도 마찬가지로 Joi 를 사용하여 ctx.request.body 를 검증해 주자. write API 에서 한 것과 비슷하지만, 여기서는 .require() 가 없다

_src/api/posts/posts.ctrl.js - update_

```javascript
(...)

export const update = async (ctx) => {
  const { id } = ctx.params;
  // write에서 사용한 schema 와 비슷한데 require() 가 없다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다.
      // false일 때는 업데이트되기 전의 데이터를 반환한다
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

- 이제 수정하면, 문자열을 전달해야 하는 title 값에 숫자를 넣을 경우 에러가 나타날 것이다.

```
PATCH http://localhost:4001/api/posts/60573f0a47d8c0436c08feea
{
    "title" : 123123
}
```

---

## 22.10 페이지네이션 구현

- 블로그에서 포스트 목록을 볼 때, 불필요하게 모든 내용을 보여 주면 로딩 속도가 지연되고, 트래픽도 낭비되므로 list API 에 페이지네이션(pagination) 기능을 구현해 보자.

### 22.10.1 가짜 데이터 생성하기

- 페이지네이션 기능을 구현하려면 우선 데이터가 충분히 있어야 하는데, 수작업으로 직접 등록을 해도 좋지만, 좀 더 편하게 데이터를 채우기 위해 가짜 데이터를 생성하는 스크립트를 작성해 보자.

- src 디렉터리에 createFakeData.js 라는 파일을 만들자.

_src/createFakeData.js_

```javascript
import Post from "./models/post";

export default function createFakeData() {
  // 0, 1, ... 39 로 이루어진 배열 생성 후 포스트 데이터로 변환
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    // https://www.lipsum.com/ 에서 복사한 200자 이상 텍스트
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["가짜", "데이터"],
  }));
  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
```

- 그 다음엔 main.js 에서 방금 만든 함수를 불러와 한 번 호출하자.

_src/main.js_

```javascript
require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import createFakeData from './createFakeData';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
    createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

(...)
```

---

### 22.10.2 포스트를 역순으로 불러오기

- 페이지 기능을 구현하기에 앞서 포스트를 역순으로 불러오는 방법을 알아보자. 현재 list API에서는 포스탁 작성된 순서대로 나열되는데, 블로그에 방문한 사람에게는 최근 작성된 포스틀 먼저 보여 주는 것이 좋다.

- 이를 구현하려면 list API 에서 exec() 를 하기 전에 sort() 구문을 넣으면 된다.

- sort 함수 파라미터는 { key : 1 } 형식으로 넣는데 key 는 정렬(sorting)할 필드를 설정하는 부분이며, 오른쪽 값을 1로 설정하면 오름차순으로, -1 로 설정하면 내림차순으로 설정한다. \_id 를 내림차순으로 정렬하자.

_src/api/posts/posts.ctrl.js - list_

```javascript
(...)

export const list = async (ctx) => {
  try {
    const posts = await Post.find().sort({ _id: -1 }).exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

- 다시 Postman 으로 list API를 호출해서 정렬이 적용되었는지 확인하자.

---

### 22.10.3 보이는 개수 제한

- 이번엔 한 번에 보이는 개수를 제한해 보겠다. 개수를 제한할 때는 limit() 함수를 사용하고, 파라미터에 제한할 숫자를 넣으면 된다. 예를 들어 열 개로 제한한다면 limit(10) 이라고 입력한다.

- list 함수의 코드를 다음과 같이 수정하자.

_src/api/posts/posts.ctrl.js - list_

```javascript
export const list = async (ctx) => {
  try {
    const posts = await Post.find().sort({ _id: -1 }).limit(10).exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

- 이제 Postman 으로 list API 를 요청하면 최근 작성된 열 개의 포스트만 불러온다.

---

### 22.10.4 페이지 기능 구현

- 페이지 기능을 구현할 준비가 어느 정도 끝났다. 페이지 기능을 구현하려면 앞 절에서 배운 limit 함수를 사용해야 하고, 추가로 skip 함수도 사용해야 한다.

- skip 이란 표현에는 '넘긴다' 라는 표현의 의미가 있는데 skip 함수에 파라미터로 10을 넣어 주면, 처음 열개를 제외하고, 그 다음 데이터를 불러온다. 20을 넣어 준다면? 처음 20개를 제외하고 그 다음 데이터 열 개를 불러온다.

- skip 함수의 파라미터에 (page -1) \* 10을 넣어 주면 된다. 1페이지에는 10개, 2페이지에는 그 다음 열개를 불러오게 된다. page 값은 query 에서 받아 오도록 설정한다. 이 값이 없으면 page 값을 1로 간주하여 코드를 작성해 보자.

_src/api/posts/posts.ctrl.js - list_

```javascript
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

---

### 22.10.5 마지막 페이지 번호 알려 주기

- 지금도 페이지로서 기능은 충분하지만 조금 더 기능을 추가하자. 마지막 페이지를 알 수 있다면, 클라이언트가 더욱 편할 것이다. 응답 내용의 형식을 바꾸어 새로운 필드를 설정 하는 방법, Response 헤더 중 Link 를 설정하는 방법, 커스텀 헤더를 설정하는 방법으로 이 정보를 알려 줄 수도 있다.

- 이 중에서 커스텀 헤더를 설정하는 방법을 사용하자.

_src/api/posts/posts.ctrl.js - list_

```javascript
(...)

export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

> Last-Page 라는 커스텀 HTTP 헤더를 설정했다. 이 값이 제대로 나타나는지 Postman 을 이용하여 확인해 보자.

![캡처](https://user-images.githubusercontent.com/50399804/111907142-64287580-8a97-11eb-83c9-f2c7125c3e66.JPG)

---

### 22.10.6 내용 길이 제한

- 이제 body의 길이가 200자 이상이면 뒤에 '···' 을 붙이고 문자열을 자르는 기능 구현해 보겠다. find() 를 통해 조회한 데이터는 mongoose 문서 인스턴스의 형태이므로 데이터를 바로 변형 할 수 없다. 그 대신 toJSON() 함수를 실행하여 JSON 형태로 변환한 뒤 필요한 변형을 일으켜 주어야 한다.

- list 함수를 다음과 같이 수정하자.

_src/api/posts/posts.ctrl.js - list_

```javascript
(...)

export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts
      .map((post) => post.toJSON())
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

- 또 다른 방법으로 데이터를 조회할 때 lean() 함수를 사용하는 방법이 있다. 이 함수를 사용하면 데이터를 처음부터 JSON 형태로 조회할 수 있다.

_src/api/posts/posts.ctrl.js - list_

```javascript
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments().exec();
    ctx.set("Last-Page", Math.ceil(postCount / 10));
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

- Postman 으로 list API 를 호출하여, body 길이가 200자로 잘 제한되었는지 확인해 보자.

![캡처](https://user-images.githubusercontent.com/50399804/111907343-3ee83700-8a98-11eb-9807-c604eb286787.JPG)

---

## 22.11 정리

- REST API에 MongoDB 를 연동하는 방법을 배우고, 쿼리를 작성하여 페이지네이션 기능까지 구현해 보았다. MongoDB 는 이 책에서 다룬 것 외에 더욱 다양하고 복잡한 쿼리도 설정할 수 있다.

- 백엔드는 결국 여러 가지 조건에 따라 클라이언트에서 전달받은 데이터를 등록하고 조회하고 수정하는 것이다. 백엔드 서버에는 현재 한 종류의 데이터 모델과 REST API 밖에 없지만, 프로젝트 규모에 따라 더욱 많은 종류의 모델과 API를 관리할 수 도 있다.

- 다음 장에서는 User 라는 데이터 모델을 만들어서 회원 인증 시스템을 구현해 보자.
