import { combineReducers } from 'redux'
import { actions } from '../actions'
import { createReducer } from '@reduxjs/toolkit';

const selectedSubreddit = createReducer('reactjs', builder => builder
  .addCase(actions.selectSubreddit, (_, action) => action.payload.subreddit));

interface PostsState {
  isFetching: boolean,
  didInvalidate: boolean,
  items: any[],
  lastUpdated?: number,
}

// typesafe하게 reducer를 생성하려면 ActionBuilder를 사용해야 하지만, ActionBuilder를 사용하면 reducer의 Action이 AnyAction이 되어버린다.
const posts = createReducer<PostsState>({
  isFetching: false,
  didInvalidate: false,
  items: [],
}, builder => builder
  .addCase(actions.invalidateSubreddit, state => { state.didInvalidate = true })
  .addCase(actions.requestPosts, state => {
    state.isFetching = true;
    state.didInvalidate = false;
  })
  .addCase(actions.receivePosts, (state, action) => {
    state.isFetching = false;
    state.didInvalidate = false;
    state.items = action.payload.posts;
    state.lastUpdated = action.payload.receivedAt;
  })
);

const postsBySubreddit = createReducer({ }, builder => builder
  .addCase(actions.invalidateSubreddit, (state, action) => ({
    ...state,
    [action.payload.subreddit]: posts(state[action.payload.subreddit], action)
  }))
  .addCase(actions.receivePosts, (state, action) => ({
    ...state,
    [action.payload.subreddit]: posts(state[action.payload.subreddit], action)
  }))
  .addCase(actions.requestPosts, (state, action) => ({
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

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
