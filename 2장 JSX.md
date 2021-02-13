## 2장 JSX



#### 2.1 코드 이해하기 



- creat-react-app 으로 만든 hello-react 디렉터리에 src/App.js  파일을 열어 보자.



_src/App.js_

![캡처](https://user-images.githubusercontent.com/50399804/106884013-1f818e80-6724-11eb-9d8a-ed1a92e1ebee.JPG)





```
import React from 'react';
```



- 리액트를 불러와서 사용할 수 있게 해주며, 프로젝트 생성 과정에서 node_modules 라는 디렉터리에 react 모듈이 설치된다.



- 모듈을 불러와서 사용하는 것은 사실 원래 브라우저에서 없던 기능이고, 브라우저가 아닌 환경에서 자바스크립트를 실행할 수 있게 해주는 환경은 Node.js 에서 지원하는 기능이다.

  ( Node.js 에서는 import 가 아닌 require 라는 구문으로 패키지를 불러올 수 있다. )



- 이러한 기능을 브라우저에서도 사용하기 위해 번들러(bundler)를 사용하고,  import 혹은 require 로 모듈을 불러왔을 때 불러온 모듈을 모두 합쳐서 하나의 파일로 생성해준다.



```
import logo from './logo.svg';
import './App.css';
```



- 웹팩 (대표적인 번들러) 을 사용하면 SVG 파일과 CSS 파일도 불러와서 사용할 수 잇는데, 웹팩의 로더(loader) 라는 기능이 담당한다. 



- 그중 babel-loader 는 자바스크립트 파일들을 불러오면서 최신 자바스크립트 문법으로 작성된 코드를 바벨이라는 도구를 사용하여 ES5 문법으로 변환 해준다.

  ( 구버전 웹 브라우저와 호환하기 위해 최신문법을 변환할 필요가 있다. )



```react
function App() {
    return (
    	<div className="App">
        	<header className="App-header">
            	<img src={logo} className="App-logo" alt="logo" />
                <p>
                	Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    targer="_blank"
                    rel="noopener noreferrer"
                    >
                	Learn React
                </a>
            </header>
        </div>	
    );
}
```



- App이라는 컴포넌트를 만들어 주며, 이러한 컴포넌트를 함수형 컴포넌트라고 부른다. ( function 키워드 사용 )



- 마치 HTML 을 작성한 것 같지만, HTML 코드가 아니고, 문자열 템플릿도 아니다. 이런 코드를 JSX 라고 부른다.



___



#### 2.2 JSX 란?

- 자바스크립트의 확장 문법 XML과 매우 비슷하게 생김



- 코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환 된다.



- 리액트로 프로젝트를 개발할 때 사용되므로 공식적인 자바스크립트 문법은 아니다.

_JSX_

```react
function App() {
	return (
    	<div>
        	Hello <b>react</b>
        </div>
    );
}
```



_변환 후_

```react
function App() {
	return React.createElement("div", null, "Hello ", React.createElement("b", null, "react"));
}
```



___



#### 2.3 JSX의 장점



###### 2.3.1 보기 쉽고 익숙하다

- 위 예시로만봐도 HTML 코드 작성하는 것과 비슷해, 훨씬 가독성 있고 사용하기 쉽다.



###### 2.3.2 더욱 높은 활용도

- 알고 있는 div나 span 같은 HTML 태그를 사용할 수  있을 뿐만 아니라, 앞으로 만들 컴포넌트도 JSX 안에서 작성 가능하다.

_src/index.js_

```react
import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// if you want your app to work offline and load faster, you can chance
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWork.unregister();


```



_엥 근데 내껀 이렇게 생겼는데?_

```react
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

> [Strict mode](https://zereight.tistory.com/587) 라고 하는데 [여기](https://ko.reactjs.org/docs/strict-mode.html) 를 참조 해보자.
  Strict mode 로 컴포넌트를 감싸면 두번 렌더링한다고 한다.. 두번 렌더링하는 이유는 여러 체크를 한다고 하는데(.. 에러라던지 .. 잘못된 메서드를 쓴다던지)





___



#### 2.4 JSX 문법



###### 2.4.1 감싸인 요소

- 컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다, 이렇게 작성해보자.



_src/App.js_



```react
import React from 'react';


function App() {
  return (
    <h1>리액트 안녕!</h1>
    <h2>잘 작동하니?</h2>
  );
}

export default App;
```





- 터미널을 실행하는 경우, 오류가 난다.



![캡처](https://user-images.githubusercontent.com/50399804/106886065-ccf5a180-6726-11eb-8522-24416c8c0767.JPG)



- 요소 여러 개가 부모 요소 하나에 의하여 감싸져 있지 않아 나는 오류로, 이렇게 해결 가능

```react
import React from 'react';


function App() {
  return (
    <div>
      <h1>리액트 안녕!</h1>
      <h2>잘 작동하니?</h2>
    </div>
  );
}

export default App;
```



- 하나의 요소로 꼭 감싸 주어야 하는 이유는 __Virtual DOM에서 컴포넌트 변화를 감지해 낼 때 효율적으로 비교할 수 있도록 컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다__는 규칙이 있기 때문



- 꼭 div 로 감쌀 필요 없고 리액트 v16 이상에서는 Fragement 라는 기능을 사용하면 된다.

```react
import React, { Fragment } from 'react';

function App() {
    return (
    	<Fragment>
        	<h1>리액트 안녕!</h1>
            <h2>잘 작동하니?</h2>
        </Fragment>
    );
}

export default App;
```



- 혹은 이렇게도 사용할 수 있다.

```react
import React, { Fragment } from 'react';

function App() {
    return (
    	<>
        	<h1>리액트 안녕!</h1>
            <h2>잘 작동하니?</h2>
        </>
    );
}

export default App;
```



![캡처](https://user-images.githubusercontent.com/50399804/106886529-586f3280-6727-11eb-8e44-11209e3752e0.JPG)





___

#### 2.4.2 자바스크립트 표현



- JSX 안에서는 자바스크립트 표현식을 쓸 수 있다. 표현식을 작성하려면 JSX 내부에서 코드를 {  }로 감싸면 된다.



_src_App.js_

```react
import React from 'react';

function App() {
    const name = '리액트 ';
    return (
        <>
        	<h1>{name} 안녕!</h1>
        	<h2>잘 작동하니?</h2>
        </>
    );
}

export default App;
```

> let, const 는 scope 함수 단위가 아닌 블록 단위 임을 알고만 가자..  너무 지겹다



___

#### 2.4.3 if 문 대신 조건부 연산자



- JSX 내부의 자바스크립트 표현식에서 if 문을 사용할 수는 없다. 하지만 조건에 따라 다른 내용을 렌더링 해야 할 때는 JSX 밖에서 if 문을 사용하여 사전에 값을
   설정하거나, { } 안에 조건부 연산자 (삼항 연산자) 를 사용하면 된다. 



_src/App.js_

```react
import React from 'react';

function App() {
    const name = '리액트';
    return (
    	<div>
        	{name === '리액트' ? ( <h1>리액트입니다.</h1>) : ( <h2>리액트가 아닙니다.</h2>) }
        </div>
    );
}
```



___

#### 2.4.4 AND 연산자(&&) 를 사용한 조건부 렌더링



- 개발하다 보면 특정 조건을 만족할 때 내용을 보여 주고, 만족하지 않을 때 아예 아무것도 렌더링 하지 않아야 하는 상황이 올 수 있다. 이럴 때도 조건부  

  연산자를 통해 구현할 수는 있다.



_src/App.js_

```react
import React from 'react';

function App() {
    const name = '리액트 ';
    return <div>{name === '리액트' ? <h1>리액트입니다.</h1> : null}</div>;
}
```

> 위 코드와 같이 null 을 렌더링하면 아무것도 보여주지 않는다.



- 위 보다 더 짧은 코드로 똑같은 작업이 가능한데, && 연산자를 사용해서 조건부 렌더링을 할 수 있다.



```react
import React from 'react';

function App() {
    const name = '뤼액트';
    return <div>{name === '리액트' && <h1>리액트입니다.</h1>}</div>;
}

export default App;
```



- && 연산자로 조건부 렌더링을 할 수 있는 이유는 리액트에서 false 를 렌더링할 때는 null 과 마찬가지로 아무것도 나타나지 않기 때문이다.  

  단, __값 0은 예외적으로 화면에 그대로 나타난다.___



> JSX를 작성할 때 괄호로 감쌀 때도, 감싸지 않을 때도 있는데, 여러 줄로 작성할 때 괄호로 감싸고, 한 줄로 표현하면 감싸지 않는다. 필수 사항이 아니다.



___

#### 2.4.5 undefined를 렌더링하지 않기



- 리액트 컴포넌트 함수에서 undefined 만 반환하여 렌더링하는 상황을 만들면 안된다.

  

_src/App.js_



```react
import React from 'react';
import './App.css';

function App() {
    const name = undefined;
    return name;
}

export default App;
```



```react
App(...): Nothing was returned from render. This usally means a return statement is missing.
    	  Or, to render nothing, return null.
```



- 어떤 값이 undefined 일 수도 있지만, OR( || )  연산자를 사용하면 이를 방지 가능하다.



```react
import React from 'react';
import './App.css';

function App() {
    const name = undefined;
    return name || '값이 undefined입니다.';
}

export default App;
```



- 반면 JSX 내부에서 undefined 를 렌더링하는 것은 괜찮다.



```react
import React from 'react';
import './App.css';

function App() {
    const name = undefined;
    return <div>{name}</div>;
}
export default App;
```



- name 값이 undefined 일 때 보여주고 싶은 문구가 있다면, 다음과 같이 작성하면 된다.



```react
import React from 'react';
import './App.css';

function App() {
    const name = undefined;
    return <div>{name || '리액트'}</div>
}

export default App;
```



___



#### 2.4.6 인라인 스타일링



- 리액트에서 DOM 요소에 스타일을 적용할 때는, 문자열 형태로 넣지 않고 객체 형태로 넣어주어야 하는데,  "-" 가 포함되는 문자의 경우, 이를 없애고  

  카멜 표기법으로 작성해야 한다. ( background-color => backgroundColor )

  

- style 객체를 미리 선언하고 지정하는 법, 미리 선언하지 않고 바로 style 값을 지정하는 법 두가지가 있다.



_src/App.js_

```react
import React from 'react';

function App() {
    const name = '리액트';
    const style = {
        backgroundColor: 'black',
        color: 'aqua',
        fontSize: '48px',
        fontWeight: 'bold',
        padding: 16
    };
    
    return <div style={style}>{name} </div>
}

export default App;
```

```react
import React from 'react';

function App() {
    const name = '리액트';
    return (
        <div
            style = {{
                backgroundColor: 'black',
                color: 'aqua',
                fontSize: '48px',
                fontWeight: 'bold',
                padding: 16
    		}}
          >
        	{name}
           </div>
    );
}

export default App;
```

![캡처](https://user-images.githubusercontent.com/50399804/106888648-362ae400-672a-11eb-9c99-fa1442f63328.JPG)

***

#### 2.4.7 class 대신 className

- HTML 에서 CSS 클래스를 사용할 때는 class 라는 속성을 사용하나, JSX 에서는 className 으로 설정해 주어야 한다.



```react
import React from 'react';
import './App.css';

function App() {
  const name = '리액트';
  return <div className='react'>{name}</div>;
}

export default App;
```



- JSX를 작성할 때 CSS 클래스를 설정하는 과정에서 className이 아닌 class 값을 설정해도 스타일이 적용되기는 하나, 브라우저 개발자 도구의 Console 탭에

  다음과 같은 경고가 나타난다.

```
Warning: Invalid DOM property `class`. Did you mean `className`?
	in div (at App.js:6)
	in App (at src/index.js:7)
```

> 이전에는 class 로 CSS 클래스를 설정할 때 오류가 발생하고, CSS 클래스가 적용되지 않았는데, 리액트 v16 이상부터는 class 를 className으로 
>
> 변환시켜주고,  경고를 띄운다.



***

#### 2.4.8 꼭 닫아야 하는 태그

- JSX에서는 태그를 닫지 않으면 오류가 발생하므로, self-closing 태그를 제외하고는 반드시 닫아줘야 한다.



_src/App.js_

```react
import React from 'react';
import './App.css';

function App() {
    const name = "리액트";
    return (
    	<>
        	<div className='react'>{name}</div>
        	<input />
        </>
    )
}
```



___

#### 2.4.9 주석



- JSX 안에서 주석을 작성하는 방법은 일반 자바스크립트에서 주석을 작성할 때와 조금 다르다.  

  

- JSX 내부에서 주석을 작성할 때는 {/* ... */} 같은 형식으로 작성한다, 기존 자바스크립트 주석 사용하는 경 그 페이지에 고스란 히 나타난다.



_src/App.js_



```react
import React from 'react';
import './App.css';

function App() {
    const name = '리액트';
    return (
        <>
        	{/* 주석은 이렇게 작성합니다. */}
        	<div
                className="react" // 시작 태그를 여러 줄로 작성하게 된다면 여기에 주석을 작성할 수 있다.
                >
        		{name}
        	</div>
        	// 하지만 이런 주석이나
        	/* 이런 주석은 페이지에 그대로 나타난다. */
        	<input />
        </>
    );
}

export default App;
```



- 렌더링이 되는 모양인데, 나는 오류가 떳다.. 책과 다르다. 오류명은 이럼, 일반 자바스크립트 주석을 지우니 작동하나. 아마 옵션이 별도로 되어있나보다.



```
src\App.js
  Line 13:16:  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textn. Did you want a JSX fragment <>...</>? (8:4)odes

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.
```



***



### 2.5 ESLint 와 Prettier 적용하기



- ESLint 는 문법 검사 도구이고, Prettier 는 코드 스타일 자동 정리 도구



#### 2.5.1 ESLint

- 입력을 잘못해서 화면에 그대로 나오고 있는 상황이라면 경고 메시지를 띄워주는데,  초록색 줄이 그어진 코드는 고치기 싫다면 무시해도 되지만,

  빨간색 줄이 그어진 코드는 반드시 고쳐야 한다. 고치지 않으면 치명적인 오류이다.

- 자세한 사용법은 첨부안할래 



#### 2.5.2 Prettier

- 코드의 가독성을 위해 들여 쓰기를 사용하는데, 다음과 같이 작성한다고 하자.

  

_App.js_

```react
import React from 'react';


function App() {
    const name = '리액트';
    return (
    	<div>
        	<div className='react'>{name
                                   }
            
            	</div>
            
            <h1> 들여쓰기 </h1>
            		<h2> 이상한 </h2>
            
            <h3> 코드 지롱~ ㅋㅋ</h3>
            	
        </div>
    )
}

export default App;
```



- VS Code 에서 F1 을 누르고 format 을 입력한 다음 Enter를 누르자.



```react
import React from "react";

function App() {
  const name = "리액트";
  return (
    <div>
      <div className="react">{name}</div>

      <h1> 들여쓰기 </h1>
      <h2> 이상한 </h2>

      <h3> 코드 지롱~ ㅋㅋ</h3>
    </div>
  );
}

export default App;

```

> 코드가 자동으로 정리 되었다. 



- Prettier의 장점은 이러한 것들을 쉽게 커스터마이징 가능 한데, 현재 열려 있는 프로젝트의 루트 디렉터리에서 .prettierrc 라는 파일을 생성 한 후,  

  관련 내용을 입력하면 된다. 관련 내용은 [여기](https://prettier.io/docs/en/options.html)을 참조 



- 저장할 때 자동으로 저장하게 하려면 VS Code 의 환경 설정 메뉴 '기본 설정' 에서 format on save 를 검색해 나타내는 체크 박스에 체크해주면 된다.

![캡처](https://user-images.githubusercontent.com/50399804/106890947-66c04d00-672d-11eb-9d86-e208aa1ffb00.JPG)



> 2장 종료
