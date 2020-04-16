import { actions } from "../actions"

export const fetchPosts = (subreddit: string) => dispatch => {
  dispatch(actions.requestPosts(subreddit))
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(actions.receivePosts(subreddit, json)))
}