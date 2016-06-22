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
        case ActionTypes.GET_SHOWS_PENDING:
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

const defaultSession = {
    movieId: null,
    episodeId: null,
    isPlaying: false,
    isPaused: true,
    devices: [],
    selectedDevice: null
};

function sessionReducer(state = {data: defaultSession, isLoading: false}, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MOVIE:
            return {data: {
                ...state.data,
                isPlaying: defaultSession.isPlaying,
                isPaused: defaultSession.isPaused,
                movieId: action.movieId,
                episodeId: defaultSession.episodeId
            }, isLoading: false};
        case ActionTypes.SELECT_EPISODE:
            return {data: {
                ...state.data,
                isPlaying: defaultSession.isPlaying,
                isPaused: defaultSession.isPaused,
                movieId: defaultSession.movieId,
                episodeId: action.episodeId
            }, isLoading: false};
        case ActionTypes.TOGGLE_PAUSE:
            return {...state, data: {...state.data, isPaused: !state.data.isPaused}};
        case ActionTypes.PLAY:
            return {...state, data: {...state.data, isPlaying: true, isPaused: false}};
        case ActionTypes.CLEAR_NOW_PLAYING:
            return {data: {
                ...state.data,
                isPlaying: defaultSession.isPlaying,
                isPaused: defaultSession.isPaused,
                movieId: defaultSession.movieId,
                episodeId: defaultSession.episodeId
            }, isLoading: false};
        case ActionTypes.STOP:
            return {...state, data: {...state.data, isPlaying: false}};
        case ActionTypes.SET_DEVICES:
            return {...state, data: {...state.data, devices: action.devices}};
        case ActionTypes.SELECT_DEVICE:
            return {...state, data: {...state.data, selectedDevice: action.device}};
        case ActionTypes.CLEAR_SELECTED_DEVICE:
            return {...state, data: {...state.data, selectedDevice: null}};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    shows: showsReducer,
    selectedTab: selectedTabReducer,
    session: sessionReducer
});
