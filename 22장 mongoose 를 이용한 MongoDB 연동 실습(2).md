## 22.5 데이터베이스의 스키마와 모델

- mongoose 에는 스키마(schema)와 모델(model) 이라는 개념이 있는데, 이 둘은 혼동하기 쉽다. 스키마는 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체이고, 모델은 스키마를 사용하여 만드는 인스턴스로, 데이터베이스에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체이다.

![651](https://user-images.githubusercontent.com/50399804/111904574-03933b80-8a8b-11eb-99bf-46bff9a1a8c9.jpg)

---

### 22.5.1 스키마 생성

- 모델을 만들려면 사전에 스키마를 만들어 주어야 한다. 블로그 포스트에 대한 스키마를 준비할 텐데, 어떤 데이터가 필요할지 생각해 보자.

  - 제목

  - 내용

  - 태그

  - 작성일

- 포스트 하나에 이렇게 총 네 가지 정보가 필요하다. 각 정보에 대한 필드 이름과 데이터 타입을 설정하여 스키마를 만든다.

![캡처](https://user-images.githubusercontent.com/50399804/111904644-4228f600-8a8b-11eb-926b-3fedfac22bce.JPG)

- 네 가지 필드가 있는 스키마를 만들어 보자. 스키마와 모델에 관련된 코드는 src/models 디렉터리에 작성하겠다. 디렉터리를 따로 만들어서 관리하면 나중에 유지 보수를 좀 더 편하게 할 수 있다. models 디렉터리를 만들고, 그 안에 post.js 파일을 만들어 다음 코드를 작성하자.

_src/models/post.js_

```javascript
import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});
```

- 스키마를 만들 때는 mongoose 모듈의 Schema 를 사용하여 정의한다. 각 필드 이름과 필드의 데이터 타입 정보가 들어 있는 객체를 작성한다. 필드의 기본값으로 default 값을 설정해 주면 된다.

- Schema 에서 기본적으로 지원하는 타입은 다음과 같다.

![캡처](https://user-images.githubusercontent.com/50399804/111904758-d4c99500-8a8b-11eb-8108-585d56a8ea9a.JPG)

<br>

- 스키마를 활용하여, 좀 더 복잡한 방식의 데이터도 저장할 수 있다.

_예시 코드_

```javascript
const AuthorSchema = new Schema({
  name: String,
  email: String,
});

const BookSchema = new Schema({
  title: String,
  description: String,
  authors: [AuthorSchema],
  meta: {
    likes: Number,
  },
  extra: Schema.Types.Mixed,
});
```

> 이렇게 스키마 내부에 다른 스키마를 내장시킬 수도 있다.

---

### 22.5.2 모델 생성

- 모델을 만들 때는 mongoose.model 함수를 사용한다. post.js 파일 맨 하단에 다음 코드를 입력해 보자.

_src/models/post.js_

```javascript
import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
```

- 모델 인스턴스를 만들고, export default 를 통해 내부내 주었다. 여기서 사용한 model() 함수는 기본적으로 두 개의 파라미터가 필요하다. 첫 번쨰 파라미터는 스키마 이름이고, 두 번쨰 파라미터는 스키마 객체이다. 데이터베이스에는 스키마 이름을 정해주면 그 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만든다.

- 예를 들어 스키마 이름을 Post로 정하면, 실제 데이터베이스에 만드는 컬렉션 이름은 posts 이다. BookInfo 를 입력하면 bookInfoes 를 만든다.

- MongoDB 에서 컬렉션 이름ㅇ르 만들 때, 권장되는 컨벤션은 구분자를 사용하지 않고 복수 형태로 사용하는 것이다. 이 컨벤션을 따르고 싶지 않다면, 다음 코드처럼 세 번째 파라미터에 원하는 이름을 입력하면 된다

```javascript
mongoose.mode("Post", PostSchema, "custom_book_collection");
```

> 첫 번쨰 파라미터로 넣어 준 이름은 나중에 다른 스키마에서 현재 스키마를 참조해야 하는 상황에 사용

---

## 22.6 MongoDB Compass의 설치 및 사용

- 생략, 책참조

---

## 22.7 데이터 생성과 조회

- 22장에서 사용했던 배열 대신에 MongoDB 에 데이터를 등록하여 데이터를 보존해 보자.

### 22.7.1 데이터 생성

- 기존에 작성했던 로직을 모두 새로 작성할 것이므로 posts.ctrl.js 에서 기존 코드를 모두 지우고 다음 코드를 입력해 보자.

_src/api/posts/posts.ctrl.js_

```javascript
import Post from "../../models/post";

export const write = (ctx) => {};

export const list = (ctx) => {};

export const read = (ctx) => {};

export const remove = (ctx) => {};

export const update = (ctx) => {};
```

> 기존 PUT 메서드에 연결했던 replace는 구현하지 않을 것이므로 아예 제거했다.

_src/api/posts/index.js_

```javascript
import Router from "koa-router";
import * as postsCtrl from "./posts.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);
posts.get("/:id", postsCtrl.read);
posts.delete("/:id", postsCtrl.remove);
posts.patch("/:id", postsCtrl.update);

export default posts;
```

- 블로그 포스트를 작성하는 API 인 write 를 구현해 보자.

_src/api/posts/posts.ctrl.js - write_

```javascript
(...)

export const write = async (ctx) => {
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
```

- 포스트의 인스턴스를 만들 때는 new 키워드를 사용한다. 생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다. 인스턴스를 만들면 바로 데이터베이스에 저장되는 것은 아니다. save() 함수를 실행시켜야 비로소 데이터베이스에 저장된다. 이 함수의 반환 값은 Promise 이므로 async/await 문법으로 데이터베이스 저장 요청을 완료할 때까지 await 를 사용하여 대기할 수 있다.

- 코드를 작성했다면 Postman 으로 다음 정보를 요청 해 보자. 3-4번 쯤 반복하여 ID가 변하는 것을 확인하고, MongoDB Compass 에서 새로 고침 버튼을 누르면 blog 데이터베이스가 나타나면서, blog 데이터베이스를 선택한 뒤 posts 컬렉션을 열어 보자.

![캡처](https://user-images.githubusercontent.com/50399804/111905333-75b94f80-8a8e-11eb-8fa2-032266292f79.JPG)

---

### 22.7.2 데이터 조회

- 이제 API를 사용하여 데이터를 조회해 보자. 데이터를 조회할 때는 모델 인스턴스의 find() 함수를 사용한다. posts.ctrl.js 의 list 함수를 다음과 같이 작성하자.

_src/api/posts/posts.ctrl.js_

```javascript
(...)

export const list = async (ctx) => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

> find() 함수를 호출한 후에는 exec() 를 붙여 주어야 서버에 쿼리를 요청한다. 데이터를 조회할 떄 특정 조건을 설정하고, 불러오는 제한도 설정할 수 있는데, 추후 페이지네이션 기능을 구현할 때 알아보자. 코드를 저장하고 서버를 재시작 한 후, Postman 으로 다음 요청을 보내자

```
GET http://localhost:4001/api/posts
```

---

### 22.7.3 특정 포스트 조회

- 이번엔 read 함수를 통해 특정 포스트를 id로 찾아서 조회하는 기능을 구현해 보자. 특정 id를 가진 데이터를 조회할 때는 findById() 함수를 사용한다.

_src/api/posts/posts.ctrl.js - read_

```javascript
(...)

export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

- 테스트 해 보자. 포스트 목록을 조회했을 때 나왔던 id 하나를 복사해 조회하자.

```
GET http://localhost:4001/api/posts/60573f0a47d8c0436c08feea
```

> id가 없다면 Status 부분에 404 오류가 발생할 것이다.

---

## 22.8 데이터 삭제와 수정

### 22.8.1 데이터 삭제

- 이번엔 데이터를 삭제해 보자. 데이터를 삭제할 때는 여러 종류의 함수를 사용할 수 있다.

  - remove(): 특정 조건을 만족하는 데이터를 모두 지운다.

  - findByIdAndRemove() : id를 찾아서 지운다.

  - findOneAndRemove() : 특정 조건을 만족하는 데이터 하나를 찾아서 제거한다.

- findByIdAndRemove() 를 사용하여, 데이터를 제거해 보자

_src/api/posts/posts.ctrl.js - remove_

```javascript
(...)

export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content ( 성공하기는 했지만 응답할 데이터가 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

(...)
```

- 코드를 저장하고, Postman 으로 조금 전 GET 했던 요청을 주소에 DELETE 요청을 하자.

```
DELETE http://localhost:4001/api/posts/60573f0a47d8c0436c08feea
```

---

### 22.8.2 데이터 수정

- 마지막으로 update 함수를 구현해 보자. 데이터를 업데이트할 때는 findByIdAndRemove() 함수를 사용한다. 이 함수를 사용할 때는 세 가지 파라미터를 넣어주어야 하는데, 첫 번째 파라미터는 id, 두 번쨰 파라미터는 업데이트 내용, 세 번쨰 파라미터는 업데이트의 옵션이다.

_src/api/posts/posts.ctrl.js - update_

```javascript
export const update = async (ctx) => {
  const { id } = ctx.params;
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

- MongoDB 를 연동한 REST API 를 개발할 수 있게 되었다.
