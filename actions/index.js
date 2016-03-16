import ActionTypes from './actionTypes';
import api from '../api';

export function loadingMovies() {
    return {
        type: ActionTypes.LOADING_MOVIES
    };
}

export function gotMovies() {
    const action = {type: ActionTypes.GOT_MOVIES};
    return dispatch => {
        return api.getMovies().then(movies => {
            action.movies = movies;
            return dispatch(action);
        }).catch(error => {
            action.error = error;
            return dispatch(action);
        });
    };
}