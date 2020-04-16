import { combineReducers } from "redux";
import * as postsBySubredditModule from "./postsBySubreddit";
import * as selectedSubredditModule from "./selected-subreddit";
import { fork } from "redux-saga/effects";

// Reducer에서 State 추론할 수 없음.
export type RootState = {
  postsBySubreddit: postsBySubredditModule.State;
  selectedSubreddit: selectedSubredditModule.State;
}

export const rootReducer = combineReducers({
  postsBySubreddit: postsBySubredditModule.reducer,
  selectedSubreddit: selectedSubredditModule.reducer
})

export function* rootSaga() {
  yield fork(postsBySubredditModule.sagaApp);
}