#### 12장 immer 를 사용하여 더 쉽게 불변성 유지하기

***

##### 12.1 immer 를 설치하고 사용법 알아보기

##### 12.1.1 프로젝트 준비

```react
yarn create react-app immer-tutorial
cd immer-tutorial
yarn add immer
```



##### 12.1.2 immer 를 사용하지 않고 불변성 유지

_App.js_

```react
import React, { useRef, useCallback, useState } from "react";

const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // input 수정을 위한 함수
  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm({
        ...form,
        [name]: [value],
      });
    },
    [form]
  );

  // from 등록을 위한 함수
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      // array에 새 항목 등록
      setData({
        ...data,
        array: data.array.concat(info),
      });

      // form 초기화
      setForm({
        name: "",
        username: "",
      });
      nextId.current += 1;
    },
    [data, form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback(
    (id) => {
      setData({
        ...data,
        array: data.array.filter((info) => info.id !== id),
      });
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```

> 전개 연산자와 배열 내장 함수를 사용하여 불변성을 유지하는 것은 어렵지 않지만, 상태가 복잡해진다면 조금 귀찮은 작업이 될 수도 있다.



##### 12.1.3 immer 사용법

- immer 를 사용하면 불변성을 유지하는 작업을 매우 간단하게 처리할 수 있다.

```react
import produce from 'immer';
const nextState = produce(originalState, draft => {
    // 바꾸고 싶은 값 바꾸기
    draft.somewhere.deep.inside = 5;
})
```

> proceduce 함수는 두 가지 파라미터를 받는다.
>
> 첫 번째 파라미터는 수정하고 싶은 상태
>
> 두 번째 파라미터는 전달되는 함수 내부에서 원하는 값을 변경하면, produce 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성해 준다.
>
> 아 라이브러리의 핵심은 '불변성에 신경 쓰지 않는 것처럼 코드를 작성하되 불변성 관리는 제대로 해 주는 것' 이다.



```react
import produce from 'immer';

const originalState = [
  {
      id: 1,
      todo: '전개 연산자와 배열 내장 함수로 불변성 유지하기',
      checked: true,
  },
  {
      id: 2,
      todo: 'immer로 불변성 유지하기',
      checked: false,
  }
];

const nextState = produce(originalState, draft => {
    // id가 2인 항목의 checked 값을 true로 설정
    const todo = draft.find(t => t.id === 2); // id로 항목 찾기
    todo.checked = true;
     // 혹은 draft[1].checked = true;
    
    // 배열에 새로운 데이터 추가
    draft.push({
        id: 3,
        todo: '일정 관리 앱에 immer 적용하기',
        checked: false,
    });
   
   // id = 1인 항목을 제거하기
    draft.splice(draft.findIndex(t => t.id===1), 1);
})
```



##### 12.1.4 App 컴포넌트에 immer 적용하기

_App.js_

```react
import React, { useRef, useCallback, useState } from "react";
import produce from "immer";

const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // input 수정을 위한 함수
  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm(
        produce(form, (draft) => {
          draft[name] = value;
        })
      );
    },
    [form]
  );

  // form 등록을 위한 함수
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      // array에 새 항목 등록
      setData(
        produce(data, (draft) => {
          draft.array.push(info);
        })
      );

      // form 초기화
      setForm({
        name: "",
        username: "",
      });
      nextId.current += 1;
    },
    [data, form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback(
    (id) => {
      setData(
        produce(data, (draft) => {
          draft.array.splice(
            draft.array.findIndex((info) => info.id === id),
            1
          );
        })
      );
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```

> immer 를 사용하여 컴포넌트 상태를 작성할 때는 객체 안에 있는 값을 직접 수정하거나, 배열에 직접적인 변화를 일으키는 push, splice 등의 함수를 사용해도
>
> 무방하다. 불변성 유지에 익숙하지 않아도 자바스크립트에 익숙하다면 컴포넌트 상태에 원하는 변화를 쉽게 반영시킬 수 있다.



##### 12.1.5 useState의 함수형 업데이트와 immer 함께 쓰기

- 11장에서 useState 의 함수형 업데이트에 대해 알아 보았다.

```react
const [number, setNumber] = useState(0);
// prevNumber는 현재 number 값을 가리 킨다.
const onIncrease = useCallback(
	() => setNumber(prevNumber => prevNumber + 1),
	[],
);
```



- immer 에서 제공하는 produce 함수를 호출할 때, 첫 번째 파라미터가 함수 형태라면 업데이트 함수를 반환한다.

```react
const update = produce(draft => {
   draft.value = 2; 
});

const originalState = {
    value: 1,
    foo: 'bar',
};

const nextState = update(originalState);
console.log(nextState); // { value: 2, foo: 'bar'}
```

> 책에는 produce 가 생략되어 있는데 뭐가 맞는지는 경험이 부족해서 모르겠다.



- 이러한 immer속성과 useState 함수형 업데이트를 함께 활용하면 코드를 더욱 깔끔하게 만들 수 있다.



_App.js_

```react
import React, { useRef, useCallback, useState } from "react";
import produce from "immer";

const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // input 수정을 위한 함수
  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm(
        produce(draft => {
          draft[name] = value;
        })
      );
    },
    []
  );

  // form 등록을 위한 함수
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      // array에 새 항목 등록
      setData(
        produce(draft => {
          draft.array.push(info);
        })
      );

      // form 초기화
      setForm({
        name: "",
        username: "",
      });
      nextId.current += 1;
    },
    [form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback(
    (id) => {
      setData(
        produce(draft => {
          draft.array.splice(
            draft.array.findIndex((info) => info.id === id),
            1
          );
        })
      );
    },
    []
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```

> 코드가 더욱 깔끔해졌다? 라지만 이걸 작성하고 있는 시점에서는 이해가 잘 안간다... 다시 공부가 필요해



##### 12.2 정리

- 유용한 라이브러리인 immer 에 대해 알아 보았다. 컴포넌트의 상태 업데이트가 조금 까다로울 때 사용하면 매우 좋다.

- 추후 상태 관리 라이브러리인 리덕스를 배워서 사용할 때도 immer 를 쓰면 코드를 매우 쉽게 작성할 수 있다.



> 12장 종료 
>
> 여기까지 왔다면... 제대로 이해는 안될 것이다.. 뒤로 돌아가서 다시 읽어보며 정리가 필요하다...

