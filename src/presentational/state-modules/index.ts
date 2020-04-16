import { combineReducers } from "redux";
import * as appModule from "./app";
import * as selectedSubredditModule from "./selected-subreddit";
import { fork } from "redux-saga/effects";

export const rootReducer = combineReducers({
  postsBySubreddit: appModule.postsBySubreddit,
  selectedSubreddit: selectedSubredditModule.reducer
})

export function* rootSaga() {
  yield fork(appModule.sagaApp);
}