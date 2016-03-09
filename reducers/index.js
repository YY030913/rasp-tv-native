import { combineReducers } from 'redux';
import ActionTypes from '../actions/actionTypes';

function moviesReducer(state = {data: [], isLoading: false}, action) {
    switch(action.type) {
        case ActionTypes.LOADING_MOVIES:
            return {...state, isLoading: true};
        case ActionTypes.GOT_MOVIES:
            return {data: action.movies, isLoading: false};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer
});
