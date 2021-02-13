## 14장 외부 API를 연동하여 뉴스 뷰어 만들기

### 14.1 비동기 작업의 이해

- 서버의 API 를 사용(AJAX) 해야 할 때는 네트워크 송수신 과정에서 시간이 걸리기 때문에 작업이 즉시 처리되는 것이 아니라, 응답을 받을 때까지 기다렸다가

  전달받은 응답데이터를 처리한다. 이때 작업을 비동기적으로 처리한다.



- setTimeout 등의 함수를 사용할 때, 콜백함수를 사용할 때, 비동기적으로 처리한다.



#### 14.1.1 콜백 함수

- 파라미터 값이 주어지면 1초 뒤에 10을 더해서 반환하는 함수가 있다고 가정, 함수가 처리된 후 어떠한 작업을 하고 싶다면 다음과 같이 콜백함수를 사용

```javascript
function increase(number, callback) {
    setTimeout(() => {
        const result = number + 10;
        if(callback) {
            callback(result);
        }
    }, 1000)
}

increase(0, result => {
   console.log(result) ;
});
```



- 1초에 걸쳐서 10, 20, 30, 40 같은 형태로 여러 번 순차적으로 처리하고 싶다면 콜백 함수를 중첩하여 구현할 수 있다.

```javascript
function increase(number, callback) {
    setTimeout(() => {
        const result = number + 10;
        if(callback) {
            callback(result);
        }
    }, 1000)
}

console.log('작업 시작');
increate(0, result => {
    console.log(result);
    increase(result, result => {
        console.log(result);
        increase(result, result => {
            console.log(result);
            increase(result, result => {
                console.log(result);
                console.log('작업 완료')
            });
        });
    });
});
```

> 코드가 너무 여러 번 중첩되니까 콜백 지옥이 나타났다...



#### 14.1.2 Promise

- Promise 를 사용하여 콜백 함수를 탈출해 보자.

```javascript
function increase(number) {
    const promise = new Promise((result, reject) => {
        // resolve는 성공, reject는 실패
        setTimeout(() => {
            const result = number + 10;
            if (result > 50) {
                // 50보다 높으면 에러 발생시키기
                const e = new Error('NumberTooBig');
                return rejct(e);
            }
            resolve(result); // number 값에 +10 후 성공 처리
        }, 1000);
    });
    return promise;
}

increase(0).
	then(number => {
    	// Promise에서 resolve된 값은 .then을 통해 받아 올 수 있음
    	console.log(number);
    	return incrase(number);
	})
	.then(number => {
    	// 또 .then으로 처리 가능
    	console.log(number);
    	return incrase(number);
	})
	.then(number => {
    	console.log(number);
    	return incrase(number);
	})
	.then(number => {
    	console.log(number);
    	return incrase(number);
	})
	.then(number => {
    	console.log(number);
    	return incrase(number);
	})
	.catch(e => {
    // 도중에 에러가 발생한다면 .catch를 통해 알 수 있음
    console.log(e);
	});
```



#### 14.1.3 async/await

- async/await 는 Promise 를 더욱 쉽게 사용할 수 있도록 해주는 문법이다. 함수의 앞 부분에 async 키워드를 추가하고, 해당 함수 내부에서 Promise 앞 부분에 await 키워드를 사용하면 된다.

```javascript
function increase(number) {
    const promise = new Promise((result, reject) => {
        // resolve는 성공, reject는 실패
        setTimeout(() => {
            const result = number + 10;
            if (result > 50) {
                // 50보다 높으면 에러 발생시키기
                const e = new Error('NumberTooBig');
                return rejct(e);
            }
            resolve(result); // number 값에 +10 후 성공 처리
        }, 1000);
    });
    return promise;
}

async function runTasks() {
    try { // try/catch 구문을 사용하여 에러를 처리.
        let result = await increament(0);
        console.log(result);
        result = await increment(result);
        console.log(result);
        result = await increment(result);
        console.log(result);
        result = await increment(result);
        console.log(result);
        result = await increment(result);
        console.log(result);
        result = await increment(result);        
		console.log(result);
    } catch (e) {
        console.log(e);
    }
}
```



***

### 14.2 axios로 API 호출해서 데이터 받아 오기

- AXIOS는 현재 가장 많이 사용 되고 있는 자바스크립트 HTTP 클라이언트이다. 이 라이브러리의 특징은 HTTP 요청을 Promise 기반으로 처리한다는 점이다.

```react
yarn create react-app news-viewer
cd news-viewer
yarn add axios
```



- Prettier 로 코드 스타일을 자동으로 정리하고 싶다면 다음 설정을 입력

_.prettierrc_

```react
{
    "singleQuote": true,
    "semi" : true,
    "useTabs": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 80
}
```



- VS Code 에서 파일 자동 불러오기 기능을 잘 활용하고 싶다면 최상위 디렉터리에 jsconfig.json 파일을 만들자

_jsconfig.json_

```react
{
    'compilerOptions': {
        'target': 'es6'
    }
}
```



_App.js_

```react
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setDate] = useState(null);
  const onClick = () => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => {
        setDate(response.data);
      });
  };
  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readonly={true}
        />
      )}
    </div>
  );
};

export default App;
```

> axios.get 함수를 사용해서 파라미터로 전달된 주소에 GET 요청을 해줬다.  .then을 통해 비동기적으로 확인할 수 있다.



- 위 함수에 async를 적용해 보자.

_App.js_

```react
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setDate] = useState(null);
  const onClick = async () => {
    try {
      const response = await axios.get(
          'https://jsonplaceholder.typicode.com/todos/1');
      setDate(response.data);
    } catch (e) {
        console.log(e);
    }
  };
  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readonly={true}
        />
      )}
    </div>
  );
};

export default App;
```



***

### 14.3 newsapi API 키 발급받기

- newsapi 에서 제공하는 API를 사용하여 최신 뉴스를 불러온 후, 보여줘야하기 때문에 [여기](https://newsapi.org/register) 에서 가입하고 발급 받자.

  발급받은 API 키는 추후 API 를 요청할 때 API 주소의 쿼리 파라미터로 넣어서 사용하면 된다.



- [여기](https://newsapi.org/s/south-korea-news-api) 에서 API 사용법을 볼 수 있고, 대걍 요악하면 다음과 같다.

  - 전체 뉴스 불러오기, 

    GET http://newsapi.org/v2/top-headlines?**country=kr**&apiKey=5db9e319dff54647a6e29de1750d0f70

  - 특정 카테고리 뉴스 불러오기, 

    GET http://newsapi.org/v2/top-headlines?**country=kr**&category=business&apiKey=5db9e319dff54647a6e29de1750d0f70



- 이를 사용하여 전체 뉴스를 불러오는 API로 대체해 보자.



_App.js_

```react
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setDate] = useState(null);
  const onClick = async () => {
    try {
      const response = await axios.get(
        'http://newsapi.org/v2/top-headlines?country=kr&apiKey=5db9e319dff54647a6e29de1750d0f70',
      );
      setDate(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readonly={true}
        />
      )}
    </div>
  );
};

export default App;
```



***

### 14.4 뉴스 뷰어 UI 만들기

- styled-components 를 사용하여 뉴스 정보를 보여 줄 컴포넌트를 만들어 보자.

```react
yarn add styled-components
```



#### 14.4.1 NewsItem 만들기

- 뉴스 데이터가 지니고 있는 정보로 NewsItem 컴포넌트를 만들어 보자.



_components/NewsItem.js_

```react
import React from 'react';
import styled from 'styled-components';

const NewsItemBlock = styled.div`
  display: flex;
  .thunbnail {
    margin-right: 1rem;
    img {
      display: block;
      width: 160px;
      height: 100px;
      object-fit: cover;
    }
  }
  .contents {
    h2 {
      margin: 0;
      a {
        color: black;
      }
    }
    p {
      margin: 0;
      line-height: 1.5;
      margin-top: 0.5rem;
      white-space: normal;
    }
  }
  & + & {
    margin-top: 3rem;
  }
`;
const NewsItem = ({ article }) => {
  const { title, description, url, urlToImage } = article;
  return (
    <NewsItemBlock>
      {urlToImage && (
        <div className="thumbnail">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={urlToImage} alt="thumbnail" />
          </a>
        </div>
      )}
      <div className="contents">
        <h2>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h2>
        <p>{description}</p>
      </div>
    </NewsItemBlock>
  );
};

export default NewsItem;
```



#### 14.4.2 NewsList 만들기

- NewsList 컴포넌트를 만들어 보자. 나중에 이 컴포넌트에 API를 요청하게 될 텐데, 아직 데이터를 불러오지 않고 있으니 sampleArticle 이라는 객체에

  미리 예시 데이터를 넣은 후 각 컴포넌트에 전달하여 가짜 내용이 보이게 해 보자.



_components/NewsList.js_

```react
import React from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const sampleArticle = {
  title: '제목',
  description: '내용',
  url: 'https://google.com',
  urlToImage: 'https://via.placeholder/com/160',
};

const NewsList = () => {
  return (
    <NewsListBlock>
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
      <NewsItem article={sampleArticle} />
    </NewsListBlock>
  );
};

export default NewsList;
```



_App.js_

```react
import React from 'react';
import NewsList from './components/NewsList';

const App = () => {
  	return <NewsList />;  
};

export default App;
```



***

### 14.5 데이터 연동하기

- NewsList 컴포넌트에서 API를 호출해 보자. 이때 useEffect 를 사용하여 컴포넌트가 처음 렌더링되는 시점에 API를 요청해 보자.

  여기서 주의할 점은 useEffect 에 등록하는 함수에 async 를 붙이면 안 된다는 것이다. useEffect 에서 반환해야 하는 값은 뒷정리 함수이기 때문이다.



- useEffect 내부에서 async/await 를 사용하고 싶다면, 함수 내부에 async 키워드가 붙은 또 다른 함수를 만들어서 사용해 주어야 한다.



- 추가로 loading 이라는 상태도 관리하여, API 요청이 대기 중인지 판별하고, 대기중일 때는 loading 값이 true, 끝나면 false 가 되어야 한다.



_components/NewsList.js_

```react
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';
import axios from 'axios';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async를 사용하는 함수 따로 선언
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://newsapi.org/v2/top-headlines?country=kr&apiKey=5db9e319dff54647a6e29de1750d0f70',
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 대기 중일 때
  if (loading) {
    return <NewsListBlock>대기 중...</NewsListBlock>;
  }
  // 아직 articles 값이 설정되지 않았을 때
  if (!articles) {
    return null;
  }

  // articles 값이 유효할 때
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={articles.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
```

> map 함수를 사용하기 전에 꼭 !articles 를 조회하여 해당 값이 현재 null 이 아닌지 검새해야 한다. 이 작업을 하지 않으면, 아직 데이터가 없을 때 null 에는 map 함수가 없기 때문에 렌더링 과정에서 오류가 발생한다. 그래서 애플리케이션이 제대로 나타나지 않고 흰 페이지만 보이게 된다.



***

### 14.6 카테고리 기능 구현하기

- 뉴스 카테고리 선택 기능을 구현해 보자.



#### 14.6.1 카테고리 선택 UI 만들기

_components/Categories.js_

```react
import React from 'react';
import styled from 'styled-components';

const categories = [
  {
    name: 'all',
    text: '전채보기',
  },
  {
    name: 'business',
    text: '비지니스',
  },
  {
    name: 'entertainment',
    text: '엔터테인먼트',
  },
  {
    name: 'health',
    text: '건강',
  },
  {
    name: 'scienece',
    text: '과학',
  },
  {
    name: 'sports',
    text: '스포츠',
  },
  {
    name: 'technology',
    text: '기술',
  },
];

const CategoriesBlock = styled.div`
  display: flex;
  padding: 1rem;
  width: 768px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Category = styled.div`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  & + & {
    margin-left: 1rem;
  }
`;
const Categories = () => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category key={c.name}>{c.text}</Category>
      ))}
    </CategoriesBlock>
  );
};

export default Categories;
```



_App.js_

```react
import React from 'react';
import NewsList from './components/NewsList';
import Categories from './components/Categories';

const App = () => {
  return (
    <>
      <Categories />
      <NewsList />
    </>
  );
};

export default App;
```



- 이제 App에서 category 상태를 useState로 관리해보자. 추가로 category 값을 업데이트하는 onSelect 함수도 만들어 보자.

  그러고 나서 category 와 onSelect 함수를 Categories 컴포넌트에게 props 로 전달해 보자.



_App.js_

```react
import React from 'react';
import NewsList from './components/NewsList';
import Categories from './components/Categories';

const App = () => {
  return (
    <>
      <Categories />
      <NewsList />
    </>
  );
};

export default App;
```



_components/Categories.js_

```react
import React from 'react';
import styled, { css } from 'styled-components';

const categories = [
  {
    name: 'all',
    text: '전채보기',
  },
  {
    name: 'business',
    text: '비지니스',
  },
  {
    name: 'entertainment',
    text: '엔터테인먼트',
  },
  {
    name: 'health',
    text: '건강',
  },
  {
    name: 'scienece',
    text: '과학',
  },
  {
    name: 'sports',
    text: '스포츠',
  },
  {
    name: 'technology',
    text: '기술',
  },
];

const CategoriesBlock = styled.div`
  display: flex;
  padding: 1rem;
  width: 768px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Category = styled.div`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  ${(props) =>
    props.active &&
    css`
      font-weight: 600;
      border-bottom: 2px solid #22b8cf;
      color: #22b8cf;
      &: hover {
        color: #3bc9db;
      }
    `}

  & + & {
    margin-left: 1rem;
  }
`;
const Categories = ({ onSelect, category }) => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          active={category === c.name}
          onClick={() => onSelect(c.name)}
        >
          {c.text}
        </Category>
      ))}
    </CategoriesBlock>
  );
};

export default Categories;
```



#### 14.6.2 API를 호출할 때 카테고리 지정하기

- NewsList 컴포넌트에서 현재 props로 받아 온 category에 따라 카테고리를 지정하여 API를 요청하도록 구현해 보자.



_components/NewsList.js_

```react
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';
import axios from 'axios';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = ({ category }) => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async를 사용하는 함수 따로 선언
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = category === 'all' ? '' : `&category=${category}`;
        const response = await axios.get(
          `http://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=5db9e319dff54647a6e29de1750d0f70`,
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [category]);

  // 대기 중일 때
  if (loading) {
    return <NewsListBlock>대기 중...</NewsListBlock>;
  }
  // 아직 articles 값이 설정되지 않았을 때
  if (!articles) {
    return null;
  }

  // articles 값이 유효할 때
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={articles.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
```

> category 값이 바뀔 때마다 뉴스를 새로 불러와야 하기 때문에 useEffect의 의존 배열(두번째 파라미터)에 category 를 넣어 주었다.
>
> 이 컴포넌트를 클래스형 컴포넌트로 만들게 된다면 componentDidMount 와 componentDidupdate 에서 요청을 시작하도록 설정해 주어야 하는데,
>
> 함수형 컴포넌트라면 이렇게 useEffect 한 번으로 컴포넌트가 맨 처음 렌더링 될 때, 그리고 category 값이 바뀔 때 요청하도록 설정해 줄 수 있다.



***

### 14.7 리액트 라우터 적용하기

- 뉴스 뷰어 프로젝트에 리액트 라우터를 적용해 보자. 기존에는 카테고리 값을 useState 로 관리했는데 이번에는 이 값을 리액트 라우터의 URL 파라미터를

  사용하여, 관리해 보자.



#### 14.7.1 리액트 라우터의 설치 및 적용

- 리액트 라우터를 설치하고, index.js 에서 리액트 라우터를 적용하자.

```react
yarn add react-router-dom
```



_index.js_

```react
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```



#### 14.7.2 NewsPage 생성

- 이번 프로젝트에 리액트 라우터를 적용할 때 만들어야 할 페이지는 단 하나이다. src 디렉터리에 pages라는 디렉터리를 생성하고, 그 안에 NewsPage.js 파일을 만들어서 다음과 같이 작성하자.



_pages/Newspage.js_

```react
import React from 'react';
import Categories from '../components/Categories';
import NewsList from '../components/NewsList';

const NewsPage = ({ match }) => {
  // 카테고리가 선택되지 않았으면 기본값 all로 사용
  const category = match.params.category || 'all';

  return (
    <>
      <Categories />
      <NewsList category={category} />
    </>
  );
};

export default NewsPage;
```

> 현재 선택된 category 값을 URL 파라미터를 통해 사용할 것이므로 Categories 컴포넌트에서 선택된 카테고리 값을 알려 줄 필요도 없고, 
>
> onSelect 함수를 따로 전달해 줄 필요도 없다.



_App.js_

```react
import React from 'react';
import { Route } from 'react-router-dom';
import NewsPage from './pages/Newspage';

const App = () => {
  return <Route path="/:category?" component={NewsPage} />;
};

export default App;
```

> /:category? 와 같은 형태는 category 값이 선택적(optional) 이라는 의미이다. category URL 파라미터가 없다면 전체 카테고리를 선택한 것으로 간주한다.



#### 14.7.3 Categories에서 NavLink 사용하기

- NavLink 로 대체해서 Categories 에서 기존의 onSelect 함수를 호출하여 카테고리를 선택하고, 선택된 카테고리에 다른 스타일을 주는 기능을 줘보자.



- div, a, button, input 처럼 일반 HTML 요소가 아닌 특정 컴포넌트에 styled-components 를 사용할 때는 styled(컴포넌트이름)`` 과 같은 형식을 사용 한다.



_components/Categories.js_

```react
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const categories = [
  {
    name: 'all',
    text: '전체보기',
  },
  {
    name: 'business',
    text: '비지니스',
  },
  {
    name: 'entertainment',
    text: '엔터테인먼트',
  },
  {
    name: 'health',
    text: '건강',
  },
  {
    name: 'scienece',
    text: '과학',
  },
  {
    name: 'sports',
    text: '스포츠',
  },
  {
    name: 'technology',
    text: '기술',
  },
];

const CategoriesBlock = styled.div`
  display: flex;
  padding: 1rem;
  width: 768px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Category = styled(NavLink)`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  &.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }

  & + & {
    margin-left: 1rem;
  }
`;
const Categories = ({ onSelect, category }) => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          activeClassName="active"
          exact={c.name === 'all'}
          to={c.name === 'all' ? '/' : `/${c.name}`}
        >
          {c.text}
        </Category>
      ))}
    </CategoriesBlock>
  );
};

export default Categories;
```

> NavLink 로 만들어진 Category 컴포넌트에 to 값은 '/카테고리이름' 으로 설정해 줬다. exact 값을 true로 해줘서 다른 카테고리가 선택되었을 때도, 전체보기
>
> 링크에 active 스타일이 적용되는 오류 발생을 막자.



***

### 14.8 usePromise 커스텀 Hook 만들기

- 컴포넌트에서 API  호출처럼 Promise 를 사용해야 하는 경우, 더욱 간결하게 코드를 작성할 수 있도록 커스텀 Hook 을 만들어서 프로젝트에 적용해 보자.



_lib/usePromise.js_

```react
import { useState, useEffect } from 'react';

export default function usePromise(promiseCreator, deps) {
  // 대기 중/완료/실패에 대한 상태 관리
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
    // eslint-disabled-next-line react-hooks/exhaustive-deps
  }, deps);

  return [loading, resolved, error];
}
```



_components/NewsList.js_

```react
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = ({ category }) => {
  const [loading, response, error] = usePromise(() => {
    const query = category === 'all' ? '' : `&category=${category}`;
    return axios.get(
      `http://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=5db9e319dff54647a6e29de1750d0f70`,
    );
  }, [category]);

  // 대기 중일 때
  if (loading) {
    return <NewsListBlock>대기 중...</NewsListBlock>;
  }

  // 아직 response 값이 설정되지 않았을 때
  if (!response) {
    return null;
  }
  // 에러가 발생했을 떄
  if (error) {
    return <NewsListBlock>에러 발생 !</NewsListBlock>;
  }

  // response 값이 유효할 때
  const { articles } = response.data;
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
```

> NewsList 에서 대기 중 상태 관리와 useEffect 설정을 직접 하지 않아도 되므로 코드가 훨씬 간결해 졌다.



***

### 14.9 정리

- 외부 API 연동하는법과, 배운것을 활용하여 실제로 쓸모있는 프로젝트를 개발해 보았다.



- 리액트 컴포넌트에서 API를 연동하여 개발할 때 절대 잊지 말아야 할 유의 사항은 useEffect 에 등록하는 함수는 async 로 작성하면 안 된다는 점이다.

  그 대신 함수 내부에 async 함수를 따로 만들어 주어야 한다.



- 뒤에 나올 리덕스아ㅗ 리덕스 미들웨어를 배우면 좀 더 쉽게 요청에 대한 상태를 관리할 수 있다.



> 14장 종료