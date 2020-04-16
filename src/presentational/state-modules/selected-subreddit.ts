import { createReducer, createAction } from "@reduxjs/toolkit";
import { Subreddit } from "../../domain/model/Subreddit";

const actions = {
  selectSubreddit: createAction('SELECT_SUBREDDIT', (subreddit: Subreddit) => ({ payload: { subreddit } })),
}

export type State = Subreddit;

export const { selectSubreddit } = actions;

export const reducer = createReducer<State>('reactjs', builder => builder
  .addCase(actions.selectSubreddit, (_, action) => action.payload.subreddit));