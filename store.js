import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import reducers from './reducers';

export function create() {
    return createStore(reducers, applyMiddleware(ReduxPromise));
}
