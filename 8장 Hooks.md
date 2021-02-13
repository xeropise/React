## 8장 Hooks

- Hooks 는 리액트 v16.8에 새로 도입된 기능으로 함수형 컴포넌트에서도 상태 관리를 하거나 렌더링 직 후 작업을 설정하는 등, 기존의 함수형

  컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해준다.



- 프로젝트 하나 생성

```react
yarn create react-app hooks-tutorial
```



***

#### 8.1 useState

- 가장 기본적인 Hook, 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다. 만약 함수형 컴포넌트에서 상태를 관리해야 한다면 이것을 사용



_Counter.js_

```react
import React, { useState } from 'react';

const Counter = () => {
    const [value, setValue] = useState(0);
    
    return(
    	<div>
        	<p>
             현재 카운터 값은 <b>{value}</b>입니다.
            </p>
            <button onClick={() => setValue(value + 1)}>+1</button>
            <button onClick={() => setValue(value - 1)}>-1</button>            
        </div>
    );
};

export default Counter;
```

> 함수의 파라미터에는 상태의 기본값을 넣어 준다. 위의 경우는 0 을 설정
>
> 함수가 호출되면 배열을 반환하는데 첫 번째 원소는 상태 값, 두 번째 원소는 상태를 설정하는 함수이다.



_App.js_

```react
import Reacct from 'react';
import Counter from './Counter';

const App = () => {
  return <Counter />;  
};

export default App;
```



##### 8.1.1 useState를 여러 번 사용하기

- 컴포넌트에서 관리해야 할 상태가 여러 개라면 useState 를 여러 번 사용하며 된다.



_Info.js_

```react
import React, { useState } from "react";

const Info = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeNickName = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
        <input value={nickname} onChange={onChangeNickName} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```



_App.js_

```react
import React from "react";
import Info from "./Info";

const App = () => {
  return <Info />;
};

export default App;
```



***

#### 8.2 useEffect

- 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook



- 클래스형 컴포넌트의 componentDidMount 와 componentDidUpdate 를 합친 형태



_Info.js_

```react
import React, { useEffect, useState } from "react";

const Info = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    console.log("렌더링이 완료되었습니다!");
    console.log({
      name,
      nickname,
    });
  });
  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeNickName = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
        <input value={nickname} onChange={onChangeNickName} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```



##### 8.2.1 마운트될 때만 실행하고 싶을 때

- 화면에 맨 처음 렌더링 될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어 있는 배열을 넣어 주면 된다.



_Info.js - useEffect_

```react
useEffect(() => {
    console.log('마운트될 때만 실행됩니다.');
}, []);
```





##### 8.2.2 특정 값이 업데이트될 때만 실행하고 싶을 때

- 특정 값이 변경될 때만 호출하고 싶은 경우에는,  두 번재 파라미터로 전달되는 배열 안에 검사하고 싶은 갚을 넣어 주면 된다.



_Info.js - useEffect_

```react
useEffect(() => {
    console.log(name);
}, [name]);
```





##### 8.2.3 뒷정리하기

- useEffect 는 기본적으로 렌더링되고 난 직후마다 실행, 두 번째 파라미터 배열에 무엇을 넣는지에 따라 실행되는 조건이 달라진다.



- 컴포넌트가 '언마운트되기 전' 이나 '업데이트되기 직전' 에 어떠한 작업을 수행하고 싶다면, 뒷정리(cleanup) 함수를 반환해주어야 한다.



_Info.js - useEffect_

```react
useEffect(() => {
    console.log('effect');
    console.log(name);
    return(() => {
        console.log('cleanup');
        console.log(name);
    });
})
```





- 오직 언마운트될 때만 뒷정리 함수를 호출하고 싶다면, useEffect 함수의 두 번째 파라미터에 비어 있는 배열을 넣으면 된다.



_Info.js - useEffect_

```react
useEffect(() => {
    console.log('effect');
    console.log(name);
    return(() => {
        console.log('cleanup');
        console.log(name);
    });
}, [name]);
```



***

#### 8.3 useReducer

- useState 보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook



- 리듀서는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션(action) 값을 전달받아 새로운 상태를 반환하는 함수

  리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜 주어야 한다.



```react
function reducer(state, action) {
    return { ... }; // 불변성을 지키면서 업데이트한 새로운 상태를 반환합니다.
}
```



> 액션 값은 주로 다음과 같은 형태

```react
{
    type: 'INCREMENT',
    // 다른 값들이 필요하다면 추가로 들어감
}
```



##### 8.3.1 카운터 구현하기



_Counter.js_

```react
import React, { useReducer } from 'react';

function reducer(state, action) {
    // action.type에 따라 다른 작업 수행 
    switch (action.type) {
        case 'INCREMENT':
            return { value: state.value + 1 };
        case 'DECREMENT':
            return { value: state.value - 1 };
        default:
          // 아무것도 해당되지 않을 때 기존 상태 반환
          return state;
    }
}

const Counter = () => {
    const [state, dispatch] = useReducer(reducer, { value: 0 });
    
    return (
    	<div>
        	<p>
            	현재 카운터 값은 <b>{state.value}</b>입니다.
            </p>
            <button onClick={() => dispatch({ type: 'INCREMENT'})}>+1</button>
            <button onClick={() => dispatch({ type: 'DECREMENT'})}>-1</button>            
        </div>
    );
};

export default Counter;
```



- useReducer 와 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에는 해당 리듀서의 기본값을 넣어 준다.



- state 값과 dispatch 함수를 받아 오는데 state는 현재 가리키고 있는 상태고, dispatch는 액션을 발생시키는 함수이다.



_App.js_

```react
import React from "react";
import Counter from "./Counter";

const App = () => {
  return <Counter />;
};

export default App;
```





#### 8.3.2 인풋 상태

- useReducer 를 사용하면 기존에 클래스형 컴포넌트에서 input 태그에 name 값을 할당하고 e.target.name을 참조하여 setState를 해 준 것과

  유사한 방식으로 작업을 처리할 수 있다.



_Info.js_

```react
import React, { useReducer } from "react";

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const Info = () => {
  const [state, disaptch] = useReducer(reducer, {
    name: "",
    nickname: "",
  });
  const { name, nickname } = state;
  const onChange = (e) => {
    dispatch(e.target);
  };

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임: </b>
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```



- useReducer 에서의 action 은 그 어떤 값도 사용 가능하다. 이벤트 객체가 지니고 있는 e.target 값 자체를 액션 값으로 사용해 봤다.

  이런 식으로 input 을 관리하면 아무리 input 개수가 많아져도 코드를 짧고 깔끔하게 유지할 수 있다.



_App.js_

```react
import React from "react";
import Info from "./Info";

const App = () => {
  return <Info />;
};

export default App;
```



***



#### 8.4 useMemo

- 함수형 컴포넌트 내부에서 발생하는 연산을 최적화할 수 있다.



- 먼저 리스트에 숫자를 추가하면 추가된 숫자들의 평균을 보여 주는 함수형 컴포넌트를 작성해 보자.



_Average.js_

```react
import React, { useState } from 'react';

const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a,b) => a + b);
    return sum / numbers.length;
};

const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');
    
    const onChange = e => {
        setNumber(e.target.value);
    };
    
    const onInsert = e => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    };
    
    return (
    	<div>
        	<input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
            	{list.map((value, index) => (
                	<li key={index}>{value}</li>
                ))}
            </ul>
            <div>
            	<b>평균값:</b> {getAverage(list)}
            </div>
        </div>
    );
};

export default Average;
```



- 그런데 숫자를 등록할 때 뿐만 아니라 input 내용이 수정될 때도 getAverage 함수가 호출되고 있다. 값이 바뀔 때마다 평균값을 다시 계산할 필요가 없는데,

  이렇게 렌더링 될때마다 계산하는 것을 useMemo Hook 을 사용하여 작업을 최적화 할 수 있다.



- 렌더링하는 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용 하는 방식



_Average.js_

```react
import React, { useState, useMemo } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = (e) => {
    setNumber(e.target.value);
  };

  const onInsert = (e) => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
  };

  const avg = useMemo(() => getAverage(list), [list]);
    
  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b> {avg}
      </div>
    </div>
  );
};

export default Average;
```

> list의 내용이 바뀔 때만 getAverage 함수가 호출된다.



***

#### 8.5 useCallback

- useMemo와 상당히 비슷한 함수로 렌더링 성능을 최적화해야 하는 상황에서 사용한다. 이벤트 핸들러 함수를 필요할 때만 생성할 수 있다.



- Average 컴포넌트를 예를 들면 onChange 와 onInsert 함수가 있는데 이렇게 선언하면 컴포넌트가 리렌더링될 때마다 이 함수들이 새로 생성된다.

  대부분의 경우 이러한 방식은 문제 없지만, 컴포넌트의 렌더링이 자주 발생하거나 렌더링해야 할 컴포넌트의 개수가 많아지면 이 부분을 최적화해

  주는 것이 좋다.



_Average.js_

```react
import React, { useState, useMemo, useCallback } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = useCallback(e => {
      setNumber(e.target.value);
  }, []); // 컴포넌트가 처음 렌더링될 때만 함수 생성
    
  const onInsert = useCallback(() => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
  }, [number, list]); // number 혹은 list가 바뀌었을 때만 함수 생성

  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b> {avg}
      </div>
    </div>
  );
};

export default Average;
```

 

- useCallback 의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 된다. 이 배열에는 어떤 값이 바뀌었을 때 함수를 새로 

  생성해야 하는지 명시해야 한다.



- 다음의 두 코드는 완전히 똑같은 코드다. useCallback 은 결국 useMemo 로 함수를 반환하는 상황에서 더 편하게 사용할 수 있는 Hook 이다.

  숫자, 문자열, 객체처럼 일반 값을 재사용하려면 useMemo,  함수를 재사용하려면 useCallback 을 사용해라. (그니까 리턴 형태에 따라 골라 쓰라는 말이네..)



```react
useCallback(() => {
    console.log('hello world');
}, [])

useMemo(() => {
    const fn = () => {
        console.log('hello world!');
    };
    return fn;
}, [])
```



***

#### 8.6 useRef

- useRef Hook은 함수형 컴포넌트에서 ref 를 쉽게 사용할 수 있도록 해 준다. Average 컴포넌트에서 등록 버튼을 눌렀을 때 포커스가 input 쪽으로 넘어가도록 코드를 작성해 보자.



_Average.js_

```react
import React, { useState, useMemo, useCallback, useRef } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");
  const inputEl = useRef(null);

  const onChange = useCallback((e) => {
    setNumber(e.target.value);
  }, []); // 컴포넌트가 처음 렌더링될 때만 함수 생성

  const onInsert = useCallback(() => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
    inputEl.current.focus();
  }, [number, list]); // number 혹은 list가 바뀌었을 때만 함수 생성

  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} ref={inputEl} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b> {avg}
      </div>
    </div>
  );
};

export default Average;
```

> useRef를 사용하여 ref 를 설정하면 useRef 를 통해 만든 객체 안의 current 값이 실제 엘리먼트를 가리킨다.





##### 8.6.1 로컬 변수 사용하기



- 추가로 컴포넌트 로컬 변수를 사용해야 할 때도 useRef 를 활용할 수 있다. 여기서 로컬 변수란 렌더링과 상관없이 바뀔 수 있는 값을 의미 한다.

  클래스 형태로 작성된 컴포넌트의 경우에는 로컬 변수를 사용해야 할 때 다음과 같이 작성할 수 있다.



```react
import React, { Component } from 'react';

class MyComponent extends Component {
    id = 1
	setId = (n) => {
        this.id = n;
    }
    printId = () => {
        console.log(this.id);
    }
    render() {
        return (
        	<div>
            	MyComponent
            </div>
        );
    }
}

export default MyComponent;
```



- 위 코드를 함수형 컴포넌트로 작성한다면 다음과 같이 작성할 수 있다.



```react
import React, { useRef } from 'react';

const RefSample = () => {
    const id = useRef(1);
    const setId = (n) => {
        id.current = n;
    }
    const printId = () => {
        console.log(id.current);
    }
    return (
    	<div>
        	refsample
        </div>
    );
};

export default RefSample;
```

> 이렇게 하면 ref 안의 값이 바뀌어도 컴포넌트가 렌더링 되지 않는다, 렌더링과 관련되지 않은 값을 관리할 때만 이러한 방식으로 코드를 작성  
  const 로 선언했는데 값은 바꿀수가 있다..? 객체 형태는 문제 되지 않는다.. 자세한 것은 [여기](https://hyunseob.github.io/2016/11/21/misunderstanding-about-const/)를 참조


***

#### 8.7 커스텀 Hooks 만들기 

- 나만의 Hook 으로 작성하여 로직을 재 사용 가능하다.



- 기존의 Info 컴포넌트에서 여러 개의 Input 을 관리하기 위해,  useReducer로 작성했떤 로직을 useInputs 라는 Hook 으로 따로 분리해 보자.



_useInputs.js_

```react
import { useReducer } from 'react';

function reducer(state, action) {
    return {
        ...state,
        [action.name]: action.value
    };
}

export default function useInputs(initialForm) {
    const [state, dispatch] = useReducer(reducer, initialForm);
    const onChange = e => {
        dispatch(e.target);
    };
    return [state, onChange];
}
```



_Info.js_

```react
import React from 'react';
import useInputs from './useInputs';

const Info = () => {
    const [state, onChange] = useInputs({
        name: '',
        nickname: ''
    });
    const { name, nickname } = state;
    
    return (
    	<div>
        	<div>
            	<input name='name' value={name} onChange={onChange} />
                <input name='nickname' value={nickname} onChange={onChange} />
            </div>
            <div>
            	<div>
                	<b>이름:</b> {name}
                </div>
                <div>
                	<b>닉네임: </b>
                    {nickname}
                </div>
            </div>
        </div>
    );
};

export default Info;
```



***

#### 8.8 다른 Hooks

- 다른 개발자가 만든 Hooks도 라이브러리로 설치하여 사용 가능하다.
  - [사이트 1](https://nikgraf.github.io/react-hooks/)
  - [사이트 2](https://github.com/rehooks/awesome-react-hooks)



***

#### 8.9 정리

- 리액트 Hooks 패턴을 사용하면 클래스형 컴포넌트를 작성하지 않고도, 대부분의 기능을 구현할 수 있다.



- 이러한 기능이 리액트에 릴리즈되었다고 해서 기존의 setState 사용 방식이 잘못된 것이 아니다



- 기존의 클래스형 컴포넌트도 앞으로도 계속해서 지원될 예정이므로 유지 보수하고 있는 프로젝트에서 클래스형 컴포너트를 사용하고 있다면,

  이를 굳이 함수형 컴포넌트와 Hooks 를 사용하는 형태로 전환할 필요는 없다, 다만 권장 



- 앞으로 프로젝트를 개발할 때는 함수형 컴포넌트의 사용을 첫 번째 옵션으로 두고, 꼭 필요한 상황에서만 클래스형 컴포넌트를 구현하자.



> 8장 종료
