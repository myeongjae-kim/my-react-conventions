import { Post } from "../domain/model/Post";

export interface RedditResponse {
  data: {
    children: Array<{data: Post}>
  }
}

export const postsApi = (subreddit: string): Promise<RedditResponse> =>
  fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())