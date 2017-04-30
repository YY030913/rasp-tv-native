import { createStore, applyMiddleware } from 'redux';
import { ActionTypes } from './constants';
import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

function logger(...keysToInclude) {
    return createLogger({
        predicate: (getState, action) => {
            if (action.type !== ActionTypes.UPDATE_POSITION) {
                return true;
            }

            return false;
        },
        stateTransformer: (state) => {
            const newState = {};
            for (const key of Object.keys(state)) {
                if (keysToInclude.includes(key)) {
                    newState[key] = state[key];
                }
            }
            return newState;
        },
        actionTransformer: (action) => {
            switch (action.type) {
                case ActionTypes.GET_SHOWS_FINISHED:
                    return {...action, shows: 'Omitted'};
                case ActionTypes.GET_MOVIES_FINISHED:
                    return {...action, movies: 'Omitted'};
                default:
                    return action;
            }
        }
    });
}

export function create() {
    // return createStore(reducers, applyMiddleware(ReduxThunk, logger('session')));
    return createStore(reducers, applyMiddleware(ReduxThunk));
}
