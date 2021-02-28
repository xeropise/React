const redux = require("redux");
const reduxLogger = require("redux-logger");
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const logger = reduxLogger.createLogger();
const combineReducers = redux.combineReducers;

// actions
// action-types
const ADD_SUBSCRIBER = "ADD_SUBSCRIBER";
const ADD_VIEWCOUNT = "ADD_VIEWCOUNT";

const addSubscriber = () => {
  return {
    type: ADD_SUBSCRIBER,
  };
};

const addViewCount = () => {
  return {
    type: ADD_VIEWCOUNT,
  };
};

// reducers
const subscriberState = {
  subscribers: 365,
};
const subscriberReducer = (state = subscriberState, action) => {
  switch (action.type) {
    case ADD_SUBSCRIBER:
      return {
        ...state,
        subscribers: state.subscribers + 1,
      };
    default:
      return state;
  }
};

const viewState = {
  viewCount: 100,
};

const viewReducer = (state = viewState, action) => {
  switch (action.type) {
    case ADD_VIEWCOUNT:
      return {
        ...state,
        viewCount: state.viewCount + 1,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  view: viewReducer,
  subscriber: subscriberReducer,
});

// store , 두번째 인자로 MiddleWare 를 넘길 수 있다.
// 두개의 리듀서를 넘길려면 combineReducer 가 필요
const store = createStore(rootReducer, applyMiddleware(logger));

// subscribe - view - dispatch

store.subscribe(() => {
  console.log("subscribe ==>>", store.getState());
});

store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addViewCount());
store.dispatch(addViewCount());
