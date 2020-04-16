import { createAction } from "@reduxjs/toolkit";
import { fetchPosts } from "../api/redditApi";

export const actions = {
  requestPosts: createAction('REQUEST_POSTS', (subreddit: string) => ({ payload: { subreddit } })),
  receivePosts: createAction('RECEIVE_POSTS', (subreddit: string, json) => ({
    payload: {
      subreddit,
      posts: json.data.children.map(child => child.data),
      receivedAt: Date.now()
    }
  })),
  selectSubreddit: createAction('SELECT_SUBREDDIT', (subreddit: string) => ({ payload: { subreddit } })),
  invalidateSubreddit: createAction('INVALIDATE_SUBREDDIT', (subreddit: string) => ({ payload: { subreddit } })),
}

export type Action = typeof actions.requestPosts
 | typeof actions.receivePosts
 | typeof actions.selectSubreddit
 | typeof actions.invalidateSubreddit

const shouldFetchPosts = (state, subreddit: string) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = (subreddit: string) => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}
