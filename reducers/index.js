import { combineReducers } from 'redux';
import { ActionTypes } from '../constants';

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

const defaultSession = {
    movieId: null,
    episodeId: null,
    isPlaying: false,
    isPaused: true,
    devices: [],
    selectedDevice: null,
    position: 0,
    duration: 0
};

function sessionReducer(state = {data: defaultSession, isLoading: false}, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MOVIE:
            return {data: {
                ...state.data,
                isPlaying: defaultSession.isPlaying,
                isPaused: defaultSession.isPaused,
                movieId: action.movieId,
                episodeId: defaultSession.episodeId,
                position: defaultSession.position,
                duration: defaultSession.duration
            }, isLoading: false};
        case ActionTypes.SELECT_EPISODE:
            return {data: {
                ...state.data,
                isPlaying: defaultSession.isPlaying,
                isPaused: defaultSession.isPaused,
                movieId: defaultSession.movieId,
                episodeId: action.episodeId,
                position: defaultSession.position,
                duration: defaultSession.duration
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
                episodeId: defaultSession.episodeId,
                position: defaultSession.position,
                duration: defaultSession.duration
            }, isLoading: false};
        case ActionTypes.STOP:
            return {...state, data: {...state.data, isPlaying: false, position: defaultSession.position}};
        case ActionTypes.SET_DEVICES:
            return {...state, data: {...state.data, devices: action.devices}};
        case ActionTypes.SELECT_DEVICE:
            return {...state, data: {...state.data, selectedDevice: action.device}};
        case ActionTypes.CLEAR_SELECTED_DEVICE:
            return {...state, data: {...state.data, selectedDevice: null}};
        case ActionTypes.UPDATE_POSITION:
            return {...state, data: {...state.data, position: action.position}};
        case ActionTypes.UPDATE_DURATION:
            return {...state, data: {...state.data, duration: action.duration}};
        case ActionTypes.UPDATE_SESSION:
            return {...state, data: {...state.data, ...action.session}};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    shows: showsReducer,
    session: sessionReducer
});
