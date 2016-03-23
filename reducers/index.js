import { combineReducers } from 'redux';
import { ActionTypes, TabIds } from '../constants';

function moviesReducer(state = {data: [], isLoading: false}, action) {
    switch(action.type) {
        case ActionTypes.GET_MOVIES_PENDING:
            return {...state, isLoading: true};
        case ActionTypes.GET_MOVIES_FINISHED:
            return {data: action.movies, isLoading: false};
    }

    return state;
}

function selectedTabReducer(state = TabIds.MOVIES_TAB, action) {
    switch (action.type) {
        case ActionTypes.SELECT_TAB:
            return action.selectedTab;
    }

    return state;
}

const defaultNowPlaying = {
    movie: null,
    episode: null,
    isPlaying: false,
    isPaused: true
};

function nowPlayingReducer(state = defaultNowPlaying, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MOVIE:
            return {...state, movie: action.movie};
        case ActionTypes.TOGGLE_PAUSE:
            return {...state, isPaused: !state.isPaused};
        case ActionTypes.PLAY:
            return {...state, isPlaying: true, isPaused: false};
        case ActionTypes.CLEAR_NOW_PLAYING:
        case ActionTypes.STOP:
            return {...defaultNowPlaying};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    selectedTab: selectedTabReducer,
    nowPlaying: nowPlayingReducer
});
