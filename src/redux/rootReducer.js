import { combineReducers } from "redux";
import commentsReducer from "./comments/reducer";
import subscribersReducer from "./subscribers/reducer";
import viewReducer from "./views/reducer";

const rootReducer = combineReducers({
  views: viewReducer,
  subscribers: subscribersReducer,
  comments: commentsReducer,
});

export default rootReducer;
