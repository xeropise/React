# 21장 21장 백엔드 프로그래밍 - Node.js의 Koa 프레임워크

- 리액트의 기본 개념을 대부분 다루어 보았다. 웹 애플리케이션을 만들 때는 리액트 같은 프런트 엔드 기술만으로 필요한 기능을 구현할 수없는 경우가 흔하다. 데이터를 여러 사람과 공유하려면 저장할 공간이 필요하기 때문이다.

## 21.1 소개하기

### 21.1.1 백엔드(back-end)

- 보통 서버를 만들어 데이터를 여러 사람과 공유한다. 그런데 서버에 데이터를 무작정 담지는 않는다. 데이터를 담을 때는 여러 규칙이 필요하다.

- 예를 들면, 특정 데이터를 등록할 때 사용자 인증 정보가 필요할 수도 있고, 등록할 데이터를 어떻게 검증할지, 데이터의 종류가 다양하다면 어떻게 구분할지 등을 고려해야 한다.

- 데이터를 조회할 때도 마찬가지다. 어떤 종류의 데이터를 몇 개씩 보여 줄지, 그리고 또 어떻게 보여 줄지 등에 관한 로직을 만드는 것을 서버프로그래밍 또는 백엔드 프로그래밍 이라고 한다.

- 백엔드 프로그래밍은 다양한 언어로 여러가지 환경에서 진행할 수 있지만, 여기선 NodeJs를 사용해 보자.

### 21.1.2 Node.js

- 자바스크립트는 웹 브라우저에서 사용했지만, 시간이 지나면서 구글이 크롬 웹 브라우저를 소개하면서 V8 이라는 자바스크립트 엔진을 공개했는데, 이 자바스크립트 엔진을 기반으로 웹 브라우저뿐만 아니라 서버에서도 자바스크립트를 사용할 수 있는 런타임을 개발했는데, 이게 Node.js 이다.

### 21.1.3 Koa

- Node.js 환경에서 웹 서버를 구축할 떄는 보통 Expres, Hapi, Koa 등의 웹 프레임워크를 사용한다. 여기서는 Koa 를 사용해보겠다.

- Koa는 Express의 기존 개발 팀이 개발한 프레임워크로, 기존 Express 에서 고치고 싶었던 점들을 개선하면 내부 설계가 완전히 바뀌기 때문에 개발 팀이 아예 새로운 프레임워크를 개발했다고 한다.

- Express 는 미들웨어, 라우팅, 템플릿, 파일 호스팅 등과 같은 다양한 기능이 자체적으로 내장되어 있는 반면, Koa 는 미들웨어 기능만 갖추고 있으며 나머지는 다른 라이브러리를 적용하여 사용한다. 즉, Koa 는 필요한 기능만 붙여서 서버를 만들 수 있기 떄문에 Express 보다 훨씬 가볍다.

- Koa는 async/await 문법을 **정식**으로 지원하기 때문에, 비동기 작업을 더 편하게 관리할 수 있다.

_express 도 async/await를 지원하는게 아닌가? 이게 무슨말일까?_

https://changjoopark.medium.com/express-%EB%9D%BC%EC%9A%B0%ED%8A%B8%EC%97%90%EC%84%9C-async-await%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A0%A4%EB%A9%B4-7e8ffe0fcc84

- Node.js로 서버를 개발할 때 어떤 프레임워크를 사용할지는 개인적인 취향에 따라 달라질수 있는데, 프로젝트를 개발할 때는 두 프레임워크 모두 사용해 보고 마음에 드는 프레임워크를 사용하도록 하자.

---

## 21.2 작업 환경 준비

### 21.2.1 Node 설치 확인

```
$ node -v
v14.15.3
```

### 21.2.2 프로젝트 생성

- 이번에 만들 프로젝트는 이 책에서 다루는 마지막 프로젝트인 블로그 서비스와 연동할 서버이므로 blog 디렉터리를 만들고, 그 내부에 blog-backend 디렉터리를 만들자. 해당 디렉터리에서 yarn init -y 명령어를 실행하여 패키지 정보를 생성하자.

```
$ mkdir blog
$ cd blog
$ mkdir blog-backend
$ cd blog-backend
$ yarn init -y
```

- 해당 파일이 잘 만들어졌는지 확인해 보자.

```
$ cat pakage.json
```

- Koa 웹 프레임워크를 설치해 보자.

```
$ yarn add koa
```

- 설치한 뒤 다시 한번 package.json 을 열어 보면, 다음과 같이 dependencies 에 추가되어 있을 꺼다.

---

### 21.2.3 ESLint 와 Prettier 설정

- 서버 파일을 작성하기 전에 ESLint 와 Prettier 를 프로젝트에 적용하자. 자바스크립트 문법을 검사하고 깔끔한 코드를 작성하기 위해서이다.

- VS Code 에서 사용하려면, VS Code 마켓플레이스에서 Prettier-Code formatter 와 ESLint 확장 프로그램을 설치해 둔 상태여야 한다.

- 먼저 ESLint 를 설치하자. 그리고 설정을 아래와 같이 설정하자. 프로젝트에 .eslintrc.json 파일이 생성되었을 것이다.

```
$ yarn add -D eslint
$ yarn run eslint --init
```

![제목 없음](https://user-images.githubusercontent.com/50399804/111868793-4ee01800-89bf-11eb-8bd3-92319174d94f.png)

- 이제 Prettier 를 설정하자. blog-backend 디렉터리에 .prettierrc 파일을 만들자.

_.prettierrc_

```json
{
  "singleQuote": true,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
```

- 다음으로 Prettier 에서 관리하는 코드 스타일은 ESLint 에서 관리하지 않도록 eslint-config-prettier 를 설치하여 적용하자.

```
$ yarn add eslint-config-prettier
```

- 설치한 후, .eslintrc.json 설정 파일을 다음과 같이 설정하면 된다.

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
    "ecmaVersion": 12
  },
  "rules": {}
}
```

- 두개의 도구가 제대로 작동하는지 확인해 보자. src 디렉터리를 생성하고, 그 안에 index.js 파일을 만들자

_src/index.js_

```javascript
const hello = "hello";
```

> const 값을 선언하고 사용하지 않으면, ESLint 기본 설정은 이를 에러로 간주한다.

- 위 같은 규칙을 끌 수도 있다. 오류 이름을 알아 두면, .eslintrc.json 에서 해당 오류를 경고로 바꾸거나 비활성화 할 수 있다.

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
    "ecmaVersion": 12
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

> 기존에 빨간색 줄로 나오던 코드가 초록색 줄로 바뀐다. ESLint 기본 설정에서는 console.log 를 사용하는 것을 지양하는데, 이번엔 사용할 것이므로 no-console을 off 로 주었다.

- 저장할 때 Prettier 를 통해, 쌍따옴표(")가 홀따옴표(') 로 바뀌는지도 확인해 보자. 저장할 때 자동으로 코드를 정리하는 설정을 활성화하지 않았다면, F1을 누른 후, format 이라고 입력하여 문서 서식(Format Document) 를 실행해 보자.
