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

function showsReducer(state = {data: [], isLoading: false}, action) {
    switch (action.type) {
        case ActionTypes.GET_SHOWS_PEDNDING:
            return {...state, isLoading: true};
        case ActionTypes.GET_SHOWS_FINISHED:
            return {data: action.shows, isLoading: false};
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
            return {...defaultNowPlaying, movie: action.movie};
        case ActionTypes.SELECT_EPISODE:
            return {...defaultNowPlaying, episode: action.episode};
        case ActionTypes.TOGGLE_PAUSE:
            return {...state, isPaused: !state.isPaused};
        case ActionTypes.PLAY:
            return {...state, isPlaying: true, isPaused: false};
        case ActionTypes.CLEAR_NOW_PLAYING:
            return {...defaultNowPlaying};
        case ActionTypes.STOP:
            return {...state, isPlaying: false};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    shows: showsReducer,
    selectedTab: selectedTabReducer,
    nowPlaying: nowPlayingReducer
});
