import * as React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, Middleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import App from './presentational/containers/App'
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from './presentational/state-modules'

const sagaMiddleware = createSagaMiddleware();

const middleware: Middleware[] = [ sagaMiddleware ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
