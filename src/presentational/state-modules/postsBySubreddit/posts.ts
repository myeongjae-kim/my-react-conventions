import { Post } from "../../../domain/model/Post";
import { createReducer, createAction } from "@reduxjs/toolkit";
import { Subreddit } from "../../../domain/model/Subreddit";
import { RedditResponse } from "../../../api/redditApi";

const actions = {
  fetchPostsAsync: {
    request: createAction('REQUEST_POSTS', (subreddit: Subreddit) => ({ payload: { subreddit } })),
    success: createAction('RECEIVE_POSTS', (subreddit: Subreddit, json: RedditResponse) => ({
      payload: {
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
      }
    })),
  }
}

export const { fetchPostsAsync } = actions;

export type Action = typeof fetchPostsAsync.request | typeof fetchPostsAsync.success;

export interface State {
  isFetching: boolean,
  items: Post[],
  lastUpdated?: number,
}

// typesafe하게 reducer를 생성하려면 ActionBuilder를 사용해야 하지만, ActionBuilder를 사용하면 reducer의 Action이 AnyAction이 되어버린다.
export const reducer = createReducer<State>({
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