import { ActionTypes } from '../constants';
import * as api from '../api';

export function getMovies() {
    return async dispatch => {
        dispatch({type: ActionTypes.GET_MOVIES_PENDING});

        const action = {type: ActionTypes.GET_MOVIES_FINISHED};
        try {
            const movies = await api.getMovies();
            action.movies = movies;
        } catch (e) {
            action.error = e;
        }

        dispatch(action);
    };
}

export function selectMovie(movieId) {
    return {
        type: ActionTypes.SELECT_MOVIE,
        movieId
    };
}
