import { createReducer, createAction } from "@reduxjs/toolkit";

const actions = {
  selectSubreddit: createAction('SELECT_SUBREDDIT', (subreddit: string) => ({ payload: { subreddit } })),
}

export const { selectSubreddit } = actions;

export const reducer = createReducer('reactjs', builder => builder
  .addCase(actions.selectSubreddit, (_, action) => action.payload.subreddit));