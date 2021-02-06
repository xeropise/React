## 5장  ref: DOM에 이름달기



- HTML에서 id를 사용하여 DOM에 이름을 다는 것처럼, 리액트 프로젝트 내부에서 이름을 다는 방법이 있다.

  바로 ref (reference의 줄임말) 개념 이다.



- ref 는 전역적으로 동작하지 않고, 컴포넌트 내부에서만 동작하기 때문에, id 를 사용하는 경우 처럼 중복건이 발생하지 않는다.



***

#### 5.1 ref는 어떤 상황에서 사용해야 할까?

- DOM을 꼭 직접적으로 건드려야 할 때 ref 를 사용



##### 5.1.1 예제 컴포넌트 생성

_ValidationSample.css_

```react
.success {
    background-color: lightgreen;
}

.failure {
    background-color: lightcoral;
}
```



_ValidationSample.js_

```react
import React, { Component } from "react";
import "./validationSample.css";

class ValidationSample extends Component {
  state = {
    password: "",
    clicked: false,
    validated: false,
  };

  handleChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleButtonClick = () => {
    this.setState({
      clicked: true,
      validated: this.state.password === "0000",
    });
  };

  render() {
    return (
      <div>
        <input
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
        />
        <button onClick={this.handleButtonClick}>검증하기</button>
      </div>
    );
  }
}

export default ValidationSample;
```



##### 5.1.2 App 컴포넌트에서 예제 컴포넌트 렌더링

- App 컴포넌트에서 ValidationSample 컴포너트를 불러와 렌더링 해보자. App 컴포넌트는 클래스형으로 작성



_App.js_

```react
import React, { Component } from "react";
import ValidationSample from "./ValidationSample";

class App extends Component {
  render() {
    return <ValidationSample />;
  }
}

export default App;
```



##### 5.1.3 DOM을 꼭 사용해야 하는 상황

- 가끔 STATE 만으로 해결할 수 없는 기능이 있다.
  - 특정 INPUT에 포커스 주기
  - 스크롤 박스 조작하기
  - Canvas 요소에 그림 그리기 등



- 위의 경우는 어쩔 수 없이 DOM에 직접적으로 접근 해야 하는데, 이를 위해 바로 ref를 사용한다.



***

#### 5.2 ref 사용

##### 5.2.1 콜백 함수를 통한 ref 설정

- ref 를 만드는 가장 기본적인 방법은 콜백 함수를 사용하는 것, ref 를 달고자 하는 요소에 ref 라는 콜백 함수를 props 로 전달

  콜백 함수는 ref 값을 파라미터로 전달받고, 함수 내부에서 컴포넌트의 멤버 변수로 설정해 준다.

```react
<input ref={(ref) => {this.input=ref}} />
```

> this.input 은 input 요소의 DOM을 가리키고, ref의 이름은 원하는 것으로 자유롭게 지정 가능하다. 
>
> 콜백 함수에 this.xeropise = ref 라고 함수를 작성하면,  컴포넌트에서 this.xeropise 로 해당 input 에  접근 가능



##### 5.2.2 createRef를 통한 ref 설정

- ref 를 만드는 또 다른 방법은 리액트에 내장되어 있는 createRef 라는 함수를 사용하는 것이다. (리액트 v16.3 이상만 사용 가능)



```react
import React, { Component } from 'react';

class RefSample extends Component {
    input = React.createRef();

	handleFocus = () => {
        this.input.current.focus();
    }
    
    render() {
        return (
        	<div>
            	<input ref={this.input} />
            </div>
        )
    }
}
```

>컴포넌트 내부에 멤버 변수로 React.createRef() 를 담아주고, 해당 멤버 변수를 ref 를 달고자 하는 요소에 ref props로 넣어 주면 완료.
>
>나중에 ref를 설정해 준 DOM에 접근하려면 this.input.current를 조회하면 된다.
>
>콜백 함수를 사용할 때와 다른 점은 뒷부분에 .current를 넣어 주어야 하는 것이다.



##### 5.2.3 적용



###### 5.2.3.1 input에 ref 달기

_ValidationSample.js의 input 요소_

```react
(...)
 		<input
 			ref={(ref) => this.input=ref}
			(...)
        />
```



###### 5.2.3.2 버튼 onClick 이벤트 코드 수정

_ValidationSample.js - handleButtonClick 메서드_

```react
handleButtonClick = () => {
    this.setState({
        clicked: true,
        validate: this.state.password === '0000'
    });
    this.input.focus();
}
```

> this.input 이 컴포넌트 내부의 input 요소를 가리키고 있으므로 일반 DOM을 다루듯이 코드 작성 가능



***

#### 5.3 컴포넌트에 ref 달기

- 리액트는 컴포넌트에도 ref를 달 수 있다. 주로 컴포넌트 내부에 있는 DOM을 컴포넌트 외부에서 사용할 때 쓴다.



- 주로 컴포넌트 내부에 있는 DOM을 컴포넌트 외부에서 사용할 때 사용한다.



##### 5.3.1 사용법

```react
<MyComponent
	ref={(ref) => {this.myComponent=ref}}    
/>
```

> 이렇게 하면 MyComponent 내부의 메서드 및 멤버 변수에도 접근 가능하다. 
>
> 즉 내부의 ref 에도 접근 가능 ( ex) myComponent.handleClick, myComponent.input 등 )



##### 5.3.2 컴포넌트 초기 설정

- ScrollBox 라는 컴포넌트를 JSX 인라인 스타일링 문법으로 스크롤 박스를 만들어보고, 최상위 돔에 ref 를 달아 보자.



###### 5.3.2.1 컴포넌트 파일 생성

_ScrollBox.js_

```react
import React, { Component } from 'react';

class ScrollBox extends Component {
    render() {
        const style = {
            boder: '1px solid black',
            height: '300px',
            width: '300px',
            overflow: 'auto',
            position: 'relative'
        };
        
        const innerStyle = {
            width: '100%',
            height: '650px',
            background: 'linear-gradient(white, black)'
        }
        
        return (
        	<div
                style = {style}
                ref={(ref) => {this.box=ref}}>
            	<div style={innerStyle}/>
            </div>
        );
    }
}

export default ScrollBox;
```



###### 5.3.2.2 App 컴포넌트에서 스크롤 박스 컴포넌트 렌더링



_App.js_

```react
import React, { Component } from 'react';
import ScrollBox from './ScrollBox';

class App extends Component {
    render() {
        return (
        	<div>
            	<ScrollBox />
            </div>
        )
    }
}

export default App;
```



##### 5.3.3 컴포넌트에 메서드 생성

- 컴포넌트에 스크롤바를 맨 아래쪽으로 내리는 메서드를 만들어 보자



- 자바스크립트로 스크롤바를 내릴 때는 DOM 노드가 가진 다음 값들을 사용한다.

  - scrollTop: 세로 스크롤바 위치(0~350)
  - scrollHeight: 스크롤이 있는 박스 안의 div 높이(650)
  - clientHeight: 스크롤이 있는 박스의 높이(300)

  스크롤바를 맨 하단으로 내리려면 scrollHeight - clientHeight 하면 된다.



_ScrollBox.js_

```react
import React, { Component } from 'react';

class ScrollBox extends Component {
    
    scrollToBottom = () => {
        const { scrollHeight, clientHeight } = this.box;
        /*
        	앞 코드에는 비구조화 할당 문법을 사용했다.
        	다음 코드와 같은 의미이다.
        	const scrollHeight = this.box.scrollHeight;
        	const clientHeight = this.box.clientHeight;
        */
        this.box.scrollTop = scrollHeight - clientHeight;
    }
    
    render() {
        (...)
    }
}

export default ScrollBox;
```

> 이렇게 만든 메서드는 부모 컴포넌트인 App 컴포넌트에서 ScrollBox에 ref를 달면 사용 가능하다.



##### 5.3.4 컴포넌트에 ref 달고 내부 메서드 사용

- ScrollBox에 ref 를 달고 버튼을 만들어 누르면, ScrollBox 컴포넌트의 scrollToBottom 메서드를 실행하도록 코드를 작성해 보자.

_App.js_

```react
import React, { Component } from 'react';
import ScrollBox from './ScrollBox';

class App extends Component {
    render() {
        return {
            <div>
            	<ScrollBox ref={(ref) => this.scrollBox=ref}/>
                <button onClick={() => this.scrollBox.scrollToBottom()}>
                 맨 밑으로
                </button>
            </div>
        };
    }    
}

export default App;
```



- 주의할 점이 있는데, 위의 onClick={() => this.scrollBox.scrollToBottom()} 으로 작성해도 문법상으로 틀린 것은 아니나, 

  컴포넌트가 처음 렌더링될 때는  this.scrollBox 값이 undefined 이므로, this.scrollBox.scrollToBottom 값을 읽어 오는 과정에서 오류가 발생



- 화살표 함수 문법을 사용하여 아예 새로운 함수를 만들고, 그 내부에서 this.scrollBox.scrollToBottom 메서드를 실행하면, 버튼을 누를 때 

  (이미 한 번 렌더링 하여, this.scrollBox를 설정한 시점) 값을 읽어 와서 실행하므로 오류가 발생하지 않는다.



***

#### 5.4 정리 



- 컴포넌트 내부에서 DOM에 직접 접근해야 할 때는 ref 를 사용하며, ref 를 사용하지 않고도 원하는 기능을 구현할 수 있는지 반드시 고려해야 한다.



- 서로 다른 컴포넌트기리 데이터 교류할 때 ref 사용한다면 이는 잘못 사용된 것이므로 (할 수는 있다.) 앱 규모가 커지면 유지 보수가 불가능하다.

  컴포넌트끼리 데이터 교류할 때는 언제나 데이터를 부모 ⇔ 자식 흐름으로 교류해야 한다.



> 5 장 종료