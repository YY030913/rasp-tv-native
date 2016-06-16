import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
// import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

export function create() {
    return createStore(reducers, applyMiddleware(ReduxThunk, ReduxPromise));
}
