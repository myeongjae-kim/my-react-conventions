import { createReducer, createAction } from '@reduxjs/toolkit';
import { call, put, takeLeading, select } from 'redux-saga/effects'
import { postsApi } from '../../../api/redditApi';
import { Subreddit } from '../../../domain/model/Subreddit';
import { RootState } from '..';
import * as postsModule from "./posts";

const actions = {
  requestPostsForce: createAction('REQUEST_POSTS_FORCE', (subreddit: Subreddit) => ({ payload: { subreddit } })),
  requestPostsIfNeeded: createAction('REQUEST_POSTS_IF_NEEDED', (subreddit: Subreddit) => ({ payload: { subreddit } })),
}

export const {requestPostsForce, requestPostsIfNeeded } = actions;

export type Action = typeof actions.requestPostsIfNeeded | postsModule.Action

export type State = {
  [key in Subreddit]?: postsModule.State
}

export const reducer = createReducer<State>({ }, builder => builder
  .addCase(postsModule.fetchPostsAsync.request, (state, action) => ({
    ...state,
    [action.payload.subreddit]: postsModule.reducer(state[action.payload.subreddit], action)
  }))
  .addCase(postsModule.fetchPostsAsync.success, (state, action) => ({
    ...state,
    [action.payload.subreddit]: postsModule.reducer(state[action.payload.subreddit], action)
  })))


// 아래같은 케이스 처리 불가능 + state를 변경하든지 새로운 state를 리턴하든지 둘 중 하나만 해야함.
// const postsBySubreddit = (state = { }, action) => {
//   switch (action.type) {
//     case INVALIDATE_SUBREDDIT:
//     case RECEIVE_POSTS:
//     case REQUEST_POSTS:
//       return {
//         ...state,
//         [action.subreddit]: posts(state[action.subreddit], action)
//       }
//     default:
//       return state
//   }
// }

export function* sagaApp() {
 yield takeLeading(actions.requestPostsIfNeeded, fetchPosts);
 yield takeLeading(actions.requestPostsForce, fetchPostsForce);
}

const shouldFetchPosts = (state: RootState, subreddit: Subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true;
  }
  if (!posts.isFetching) {
    return true
  }

  return false;
}

// ActionCreator에서 Action 추론하는 util type 없음.
const __REQUEST_POSTS = actions.requestPostsIfNeeded("frontend");
function* fetchPosts(action: typeof __REQUEST_POSTS) {
  const {subreddit} = action.payload;
  const state: RootState = yield select();
  if (!shouldFetchPosts(state, subreddit)) {
    return;
  }

  yield put(postsModule.fetchPostsAsync.request(subreddit));

  try {
     const json = yield call(postsApi, action.payload.subreddit);
     yield put(postsModule.fetchPostsAsync.success(subreddit, json));
  } catch (e) {
  }
}

// ActionCreator에서 Action 추론하는 util type 없음.
const __REQUEST_POSTS_FORCE = actions.requestPostsForce("frontend");
function* fetchPostsForce(action: typeof __REQUEST_POSTS_FORCE) {
  const {subreddit} = action.payload;
  yield put(postsModule.fetchPostsAsync.request(subreddit));

  try {
     const json = yield call(postsApi, action.payload.subreddit);
     yield put(postsModule.fetchPostsAsync.success(subreddit, json));
  } catch (e) {
  }
}