## 15장 Context API

### 15.1 Context API 를 사용한 전역 상태 관리 흐름 이해하기

- 프로젝트 내에서 환경 설정, 사용자 정보와 같은 전역적으로 필요한 상태를 관리해야 할 때는 어떻게 할까? 리액트 애플리케이션은 컴포넌트 간에 데이터를 props 로 전달하기 때문에 컴포넌트 여기저기서 필요한 데이터가 있을 때는 주로 최상위 컴포넌트 App의 state 에 넣어서 관리한다.



- 위처럼 관리하는 경우, 많은 컴포넌트를 거쳐야 할 때도 있고 다루어야 하는 데이터가 훨씬 많아질 수도 있으므로, 이런 방식을 사용하면 유지 보수성이 낮아질 가능성이 있다.



- 리덕스나 MobX 같은 상태 관리 라입러리를 사용하여 전역 상태 관리 작업을 편하게 하기도 하는데, 리액트 v16.3 업데이트 이후에는 Context API 가 많이 개선돼 별도의 라이브러리를 사용하지 않아도 전역 상태를 손쉽게 관리할 수 있다.



***

### 15.2 Context API 사용법 익히기

- 연습할 리액트 프로젝트를 새로 생성하자.

```react
yarn create react-app context-tutorial
```



#### 15.2.1 새 Context 만들기

```react
mkdir src/contexts
cd contexts
touch color.js
```

> Context를 만들 때 반드시 contexts 디렉터리에 만들 필요는 없다. 마음대로 경로를 지정해도 상관 없음.



_contexts/color.js_

```react
import { createContext } from 'react';

const ColorContext = createContext({ color: 'black' });

export default ColorContext
```



#### 15.2.2 Consumer 사용하기

- ColorBox 라는 컴포넌트를 만들어서 ColorContext 안에 들어 있는 색상을 보여 주자. 색상을 props 로 받아오는게 아니라 ColorContext 안에 들어 있는 Consumer 라는 컴포넌트를 통해 색상을 조회하겠다.



_components/ColorBox.js_

```react
import React from 'react';
import ColorContext from '../contexts/color';

const ColorBox = () => {
    return (
    	<ColorContext.Consumer>
        	{ value => (
            	<div
                    style={{
                        width: '64px',
                        height: '64px',
                        background: value.color
                    }}
                />
            )}
        </ColorContext.Consumer>
    );
};

export default ColorBox;
```

> Consumer 사이에 중괄호를 열어서 그 안에 함수를 넣어 주었다. 이러한 패턴을 Function as a child, 혹은 Render Props 라고 한다.
>
> 컴포넌트의 children이 있어야 할 자리에 일반 JSX 혹은 문자열이 아닌 함수를 전달하는 것



_App.js_

```react
import React from 'react';
import ColorBox from './components/ColorBox';
const App = () => {
  	return (
        <div>
        	<ColorBox />
        </div>
    );
};

export default App;
```





#### 15.2.3 Provider

- Provider 를 사용하면 Context의 value 를 변경할 수 있다.



_App.js_

```react
import React from "react";
import ColorBox from "./components/ColorBox";
import ColorContext from "./contexts/color";
const App = () => {
  return (
    <ColorContext.Provider value={{ color: "red" }}>
      <div>
        <ColorBox />
      </div>
    </ColorContext.Provider>
  );
};

export default App;

```

> Provider 를 사용했는데 value 를 명시하지 않았다면, 기본값을 사용하지 않기 때문에 오류가 발생한다.



_오류가 발생하는 App.js_

```react
import React from "react";
import ColorBox from "./components/ColorBox";
import ColorContext from "./contexts/color";
const App = () => {
  return (
    <ColorContext.Provider>
      <div>
        <ColorBox />
      </div>
    </ColorContext.Provider>
  );
};

export default App;
```

> Provider 를 사용할 때는 value 값을 명시해 주어야 제대로 작동한다는 것을 기억하자.



***

### 15.3 동적 Context 사용하기

- 지금까지 한 내용으로는 고정적인 값만 사용할 수 있었는데, 이번엔 Context 값을 업데이트해야 하는 경우 어떻게 해야하는지 알아보자.



#### 15.3.1 Context 파일 수정하기

- Context 의 value 에는 무조건 상태 값이 있어야 하는 것은 아니다. 함수를 전달해 줄 수도 있다.

  기존에 작성했던 ColorContext의 코드를 다음과 같이 수정하자. 이번에 코드를 작성한 후 저장하면 오류가 발생하는데, 해당 오류는 나중에 수정할 것



_context/color.js_

```react
import React, { createContext, useState } from "react";

const ColorContext = createContext({
  state: { color: "black", subcolor: "red" },
  actions: {
    setColor: () => {},
    setSubcolor: () => {},
  },
});

const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("black");
  const [subcolor, setSubcolor] = useState("red");

  const value = {
    state: { color, subcolor },
    actions: { setColor, setSubcolor },
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

// const ColorConsumer = ColorContext.Consumer 와 같은 의미
const { Consumer: ColorConsumer } = ColorContext;

// ColorProvider와 ColorConsumer 내보내기
export { ColorProvider, ColorConsumer };

export default ColorContext;
```

> ColorProvider 라는 컴포넌를 새로 작성해 주고 ColorContext.Provider 를 렌더링하고 있다.
>
> Context 에서 값을 동적으로 사용할 때 반드시 묶어 줄 필요는 없지만, 이렇게 state 와 actions 객체를 따로따로 분리해 주면 나중에 다른 컴포넌트에서
>
> Context 의 값을 사용할 때 편하다.
>
> createContext 를 사용할 때 기본값으로 사용할 객체도 수정했다. createContext 의 기본값은 실제 Provider 의 value 에 넣는 객체의 형태와
>
> 일치시켜 주는 것이 좋다. 내부 값이 어떻게 구성되어 있는지 파악하기도 쉽고, 실수로 Provider를 사용하지 않았을 때 리액트 애플리케이션에서 에러가
>
> 발생하지도 않는다.



#### 15.3.2 새로워진 Context 를 프로젝트에 반영하기

- App 컴포넌트에서 ColorContext.Provider 를 ColorProvider 로 대체하자.

  

_App.js_

```react
import React from "react";
import ColorBox from "./components/ColorBox";
import { ColorProvider } from "./contexts/color";
const App = () => {
  return (
    <ColorProvider>
      <div>
        <ColorBox />
      </div>
    </ColorProvider>
  );
};

export default App;
```



- ColorBox 도 마찬가지로 ColorContext.Consumer 를 ColorConsumer 로 변경하자. 사용할 value 의 형태도 바뀌었으니, 이에 따른 변화를 다음과 같이 반영하자.



_components/ColorBox.js_

```react
import React from "react";
import { ColorConsumer } from "../contexts/color";

const ColorBox = () => {
  return (
    <ColorConsumer>
      {(value) => (
        <>      
        <div
          style={{
            width: "64px",
            height: "64px",
            background: value.state.color
          }}
        />
        <div
          style={{
            width: "32px",
            height: "32px",
            background: value.state.subcolor
          }}
        />
        </>
      )}
    </ColorConsumer>
  );
};

export default ColorBox;
```



- 위 코드에서 객체 비구조화 할당 문법을 사용하면 다음과 같이 value 를 조회하는 것을 생략할 수 있다.



_components/ColorBox.js_

```react
import React from "react";
import { ColorConsumer } from "../contexts/color";

const ColorBox = () => {
  return (
    <ColorConsumer>
      {({ state }) => (
        <>      
        <div
          style={{
            width: "64px",
            height: "64px",
            background: state.color
          }}
        />
        <div
          style={{
            width: "32px",
            height: "32px",
            background: state.subcolor
          }}
        />
        </>
      )}
    </ColorConsumer>
  );
};

export default ColorBox;
```



#### 15.3.3 색상 선택 컴포넌트 만들기

- 이번에는 Context 의 actions 에 넣어 준 함수를 호출하는 컴포넌트를 만들어 보자. 지금은 Consumer 를 사용하지 않고 UI만 준비해 보자.



_components/SelectColors.js_

```react
import React from "react";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

const SelectColors = () => {
  return (
    <div>
      <h2>색상을 선택하세요.</h2>
      <div style={{ display: "flex" }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              background: color,
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectColors;
```



_App.js_

```react
import React from "react";
import ColorBox from "./components/ColorBox";
import { ColorProvider } from "./contexts/color";
import SelectColors from "./components/SelectColors";

const App = () => {
  return (
    <ColorProvider>
      <div>
        <SelectColors />
        <ColorBox />
      </div>
    </ColorProvider>
  );
};

export default App;
```



- 이제 해당 SelectColors 에서 마우스 왼쪽 버튼을 클릭하면 큰 정사각형의 색상을 변경하고, 마우스 오른쪽 버튼을 클릭하면 작은 정사각형의 색상을 변경하도록 구현해 보자.



_components/SelectColors.js_

```react
import React from "react";
import { ColorConsumer } from "../contexts/color";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

const SelectColors = () => {
  return (
    <div>
      <h2>색상을 선택하세요.</h2>
      <ColorConsumer>
        {({ actions }) => (
          <div style={{ display: "flex" }}>
            {colors.map((color) => (
              <div
                key={color}
                style={{
                  background: color,
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={() => actions.setColor(color)}
                onContextMenu={(e) => {
                  e.preventDefault(); // 마우스 오른쪽 버튼 클릭 시 메뉴가 뜨는 것을 무시함
                  actions.setSubcolor(color);
                }}
              />
            ))}
          </div>
        )}
      </ColorConsumer>
    </div>
  );
};

export default SelectColors;

```

> 마우스 오른쪽 버튼 클릭 이벤트는 onContextMenu 를 사용하면 된다. 원래는 브라우저 메뉴가 나타나지만, 여기서 e.preventDefault() 를 호출하면 메뉴가
>
> 뜨지 않는다.



***

### 15.4 Consumer 대신 Hook 또는 static contextType 사용하기

- 이번에는 Context 에 있는 값을 사용할 때 Consumer 대신 다른 방식을 사용하여 값을 받아 오는 방법을 알아보겠다.



#### 15.4.1 useContext Hook 사용하기

- 리액트에 내장되어 있는 Hooks 중에서 useContext 라는 Hook 을 사용하면, 함수형 컴포넌트에서 Context 를 아주 편하게 사용할 수 있다.



_components/ColorBox.js_

```react
import React, { useContext } from "react";
import ColorContext from "../contexts/color";

const ColorBox = () => {
  const { state } = useContext(ColorContext);
  return (
    <>
      <div
        style={{
          width: "64px",
          height: "64px",
          background: state.color,
        }}
      />
      <div
        style={{
          width: "32px",
          height: "32px",
          background: state.subcolor,
        }}
      />
    </>
  );
};

export default ColorBox;

```

> 이전보다 훨씬 간결해졌으나, Hook 은 함수형 컴포넌트에서만 사용할 수 있따는 점에 주의하자. 클래스형 컴포넌트에서는 Hook 을 사용할 수 없다.



#### 15.4.2 static contextType 사용하기

- 클래스형 컴포넌트에서 Context 를 좀 더 쉽게 사용하고 싶다면 static contextType 을 정의하는 방법이 있다.

  SelectColors 컴포넌트를 다음과 같이 클래스형으로 변환해 보자. 그리고 Consumer 쪽 코드는 일단 제거하자.



_components/SelectColors.js_

```react
import React, { Component } from "react";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

class SelectColors extends Component {
  render() {
    return (
      <div>
        <h2>색상을 선택하세요.</h2>
        <div style={{ display: "flex" }}></div>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              background: color,
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        ))}
        <hr />
      </div>
    );
  }
}

export default SelectColors;
```



- 그리고 클래스 상단에 static contextType 값을 지정해 주자.



_components/SelectColors.js_

```react
import React, { Component } from "react";
import ColorContext from "../contexts/color";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

class SelectColors extends Component {
  static contextType = ColorContext;
  render() {
    return (
      <div>
        <h2>색상을 선택하세요.</h2>
        <div style={{ display: "flex" }}></div>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              background: color,
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        ))}
        <hr />
      </div>
    );
  }
}

export default SelectColors;
```



- 이렇게 하고 this.context 를 조회했을 때 현재 Context 의 value 를 가리키게 된다. 만약 setColor 를 호출하고 싶다면 this.context.actions.setColor 를 

  호출하면 된다. 다음과 같이 완성해 보자.



_components/SelectColors.js_

```react
import React, { Component } from "react";
import ColorContext from "../contexts/color";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

class SelectColors extends Component {
  static contextType = ColorContext;

  handleSetColor = (color) => {
    this.context.actions.setColor(color);
  };

  handleSetSubcolor = (subcolor) => {
    this.context.actions.setSubcolor(subcolor);
  };
  render() {
    return (
      <div>
        <h2>색상을 선택하세요.</h2>
        <div style={{ display: "flex" }}></div>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              background: color,
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
            onClick={() => this.handleSetColor(color)}
            onContextMenu={(e) => {
              e.preventDefault();
              this.handleSetSubcolor(color);
            }}
          />
        ))}
        <hr />
      </div>
    );
  }
}

export default SelectColors;
```

> static contextType 을 정의하면 클래스 메서드에서도 Context 에 넣어 둔 함수를 호출할 수 있다는 장점이 있다.
>
> 단점이라면, 한 클래스에서 하나의 Context 밖에 사용하지 못한다는 것이다.
>
> 클래스형으로 작성하는 일이 많지 않기 때문에 useContext 를 사용하는 쪽을 권한다.



***

### 15.5 정리



- 기존에는 컴포넌트 간에 상태를 교류해야 할 때 무조건 부모 -> 자식 흐름으로 props 를 통해 전달해 주었는데, 이제는 Context API 를 통해 더욱 쉽게 상태를

  교류할 수 있게 되었다.



- 전역적으로 여기저기서 사용되는 상태가 있고, 컴포넌트의 개수가 많은 상황이라면, Context API를 사용하는 것을 권한다.



- 다음 장에서는 리덕스라는 상태 관리 라이브러리를 배워 보겠다. 이 라이브러리는 Context API 기반으로 만들어져 있으며, Context API 와 마찬가지로

  전역 상태 관리를 도와준다. 리액트 v16.3 에서 Context API 가 개선되기 전에는 주로 리덕스를 사용하여 전역 상태를 관리해 왔다.

  단순한 전역 상태 관리라면 Context API 로 리덕스를 대체할 수도 있다.



> 15장 종료
