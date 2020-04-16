import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import { requestPostsForce, requestPostsIfNeeded } from '../state-modules/postsBySubreddit'
import { selectSubreddit } from '../state-modules/selected-subreddit'
import { Subreddit, SUBREDDITS } from '../../domain/model/Subreddit'
import { Post } from '../../domain/model/Post'
import { RootState } from '../state-modules'
import { createSelector } from '@reduxjs/toolkit'
import * as postsBySubredditModule from "../state-modules/postsBySubreddit"
import * as selectedSubredditModule from "../state-modules/selected-subreddit"
import { usePrevious } from '../../util/usePrevious'

interface Props {
  selectedSubreddit: Subreddit,
  posts: Post[],
  isFetching: boolean,
  lastUpdated?: number,
}

const selector = createSelector<
  RootState,
  postsBySubredditModule.State,
  selectedSubredditModule.State,
  Props
>(
  state => state.postsBySubreddit,
  state => state.selectedSubreddit,
  (postsBySubreddit, selectedSubreddit) => {
    const {
      isFetching,
      lastUpdated,
      items: posts
    } = postsBySubreddit[selectedSubreddit] || {
      isFetching: true,
      items: []
    }

    return {
      selectedSubreddit,
      posts,
      isFetching,
      lastUpdated
    }
  }
)

const App: React.FC = () => {
  const props = useSelector(selector);
  const prev = usePrevious(props);

  const { selectedSubreddit, posts, isFetching, lastUpdated } = props;
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(requestPostsIfNeeded(selectedSubreddit));
  }, [dispatch, selectedSubreddit])

  React.useEffect(() => {
    if (prev && prev.selectedSubreddit !== selectedSubreddit) {
      dispatch(requestPostsIfNeeded(selectedSubreddit))
    }
  }, [dispatch, prev, selectedSubreddit])

  const handleChange = React.useCallback((nextSubreddit: Subreddit) => {
    dispatch(selectSubreddit(nextSubreddit))
  }, [dispatch]);

  const handleRefreshClick = React.useCallback((e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch(requestPostsForce(selectedSubreddit))
  }, [dispatch, selectedSubreddit]);

  const isEmpty = React.useMemo(() => posts.length === 0, [posts])
  return (
    <div>
      <Picker value={selectedSubreddit}
        onChange={handleChange}
        options={SUBREDDITS} />
      <p>
        {lastUpdated &&
          <span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
          </span>
        }
        {!isFetching &&
          <button onClick={handleRefreshClick}>
            Refresh
            </button>
        }
      </p>
      {isEmpty
        ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
        : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={posts} />
        </div>
      }
    </div>
  )
}

export default App;
