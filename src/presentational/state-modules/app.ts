import { createReducer, createAction } from '@reduxjs/toolkit';
import { call, put, takeLeading, select } from 'redux-saga/effects'
import { postsApi, RedditResponse } from '../../api/redditApi';
import { Post } from '../../domain/model/Post';

const actions = {
  requestPostsForce: createAction('REQUEST_POSTS_FORCE', (subreddit: string) => ({ payload: { subreddit } })),
  requestPostsIfNeeded: createAction('REQUEST_POSTS_IF_NEEDED', (subreddit: string) => ({ payload: { subreddit } })),
  fetchPostsAsync: {
    request: createAction('REQUEST_POSTS', (subreddit: string) => ({ payload: { subreddit } })),
    success: createAction('RECEIVE_POSTS', (subreddit: string, json: RedditResponse) => ({
      payload: {
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
      }
    })),
  }
}

export const {requestPostsForce, requestPostsIfNeeded} = actions;

export type Action = 
 typeof actions.requestPostsIfNeeded
 | typeof actions.fetchPostsAsync.request
 | typeof actions.fetchPostsAsync.success

interface PostsState {
  isFetching: boolean,
  items: Post[],
  lastUpdated?: number,
}

// typesafe하게 reducer를 생성하려면 ActionBuilder를 사용해야 하지만, ActionBuilder를 사용하면 reducer의 Action이 AnyAction이 되어버린다.
const posts = createReducer<PostsState>({
  isFetching: false,
  items: [],
}, builder => builder
  .addCase(actions.fetchPostsAsync.request, state => {
    state.isFetching = true;
  })
  .addCase(actions.fetchPostsAsync.success, (state, action) => {
    state.isFetching = false;
    state.items = action.payload.posts;
    state.lastUpdated = action.payload.receivedAt;
  })
);

interface PostsContainerState {
  [x: string]: PostsState
}

export const postsBySubreddit = createReducer<PostsContainerState>({ }, builder => builder
  .addCase(actions.fetchPostsAsync.request, (state, action) => ({
    ...state,
    [action.payload.subreddit]: posts(state[action.payload.subreddit], action)
  }))
  .addCase(actions.fetchPostsAsync.success, (state, action) => ({
    ...state,
    [action.payload.subreddit]: posts(state[action.payload.subreddit], action)
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


const shouldFetchPosts = (state, subreddit: string) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true;
  }
  if (!posts.isFetching) {
    return true
  }

  return false;
}

const __REQUEST_POSTS = actions.requestPostsIfNeeded("any");
function* fetchPosts(action: typeof __REQUEST_POSTS) {
  const {subreddit} = action.payload;
  const state = yield select();
  if (!shouldFetchPosts(state, subreddit)) {
    return;
  }

  yield put(actions.fetchPostsAsync.request(subreddit));

  try {
     const json = yield call(postsApi, action.payload.subreddit);
     yield put(actions.fetchPostsAsync.success(subreddit, json));
  } catch (e) {
  }
}

const __REQUEST_POSTS_FORCE = actions.requestPostsForce("any");
function* fetchPostsForce(action: typeof __REQUEST_POSTS_FORCE) {
  const {subreddit} = action.payload;
  yield put(actions.fetchPostsAsync.request(subreddit));

  try {
     const json = yield call(postsApi, action.payload.subreddit);
     yield put(actions.fetchPostsAsync.success(subreddit, json));
  } catch (e) {
  }
}