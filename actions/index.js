import { ActionTypes } from '../constants';
import api from '../api';

function basicAction(type) {
    return {
        type
    };
}

export const loadingMovies = basicAction.bind(null, ActionTypes.GET_MOVIES_PENDING);
export const clearNowPlaying = basicAction.bind(null, ActionTypes.CLEAR_NOW_PLAYING);

export function gotMovies() {
    const action = {type: ActionTypes.GET_MOVIES_FINISHED};
    return api.getMovies().then(movies => {
        action.movies = movies;
        return action;
    }).catch(error => {
        action.error = error;
        return action;
    });
}

export function selectTab(tab) {
    return {
        type: ActionTypes.SELECT_TAB,
        selectedTab: tab
    };
}

export function selectMovie(movie) {
    return {
        type: ActionTypes.SELECT_MOVIE,
        movie
    };
}

export function playMovie(id) {
    const action = {type: ActionTypes.PLAY};
    return api.playMovie(id)
        .then(() => action)
        .catch(err => {
            action.error = err;
            return action;
        });
}

export function togglePause() {
    const action = {type: ActionTypes.TOGGLE_PAUSE};
    return api.toggle()
        .then(() => action)
        .catch(err => {
            action.error = err;
            return action;
        });
}

export function stopVideo() {
    const action = {type: ActionTypes.STOP};
    return api.stop()
        .then(() => action)
        .catch(err => {
            action.error = err;
            return action;
        });
}
