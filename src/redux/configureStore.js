import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composedReduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: true,
  }) : null;
/* eslint-enable no-underscore-dangle */
const composeEnhancers = composedReduxDevTool || compose;

const middlewares = [
  sagaMiddleware,
];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore() {
  const store = createStore(
    rootReducer,
    enhancer
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
