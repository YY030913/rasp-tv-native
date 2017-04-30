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
    position: 0,
    duration: 0,
    isConnected: false
};

function sessionReducer(state = {data: defaultSession, isLoading: false}, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MOVIE:
            return {...state, data: {...state.data, movieId: action.movieId, episodeId: null } };
        case ActionTypes.SELECT_EPISODE:
            return {...state, data: {...state.data, episodeId: action.episodeId, movieId: null } };
        case ActionTypes.TOGGLE_PAUSE:
            return {...state, data: {...state.data, isPaused: !state.data.isPaused}};
        case ActionTypes.PLAY:
            return {...state, data: {...state.data, isPlaying: true, isPaused: false}};
        case ActionTypes.STOP:
        case ActionTypes.CLEAR_NOW_PLAYING:
            return {
                data: {...defaultSession, isConnected: state.data.isConnected },
                isLoading: false
            };
        // case ActionTypes.STOP:
        //     return {
        //         ...state,
        //         data: {
        //             ...state.data,
        //             isPlaying: false,
        //             position: defaultSession.position,
        //             isPaused: defaultSession.isPaused,
        //             episodeId: null,
        //             movieId: null
        //         }
        //     };
        case ActionTypes.UPDATE_POSITION:
            return {...state, data: {...state.data, position: action.position}};
        case ActionTypes.UPDATE_DURATION:
            return {...state, data: {...state.data, duration: action.duration}};
        case ActionTypes.UPDATE_SESSION:
            return {...state, data: {...state.data, ...action.session}};
        case ActionTypes.CONNECT_TO_DEVICE:
            return {...state, data: {...state.data, isConnected: true }};
        case ActionTypes.DISCONNECT_FROM_DEVICE:
            return {...state, data: {...state.data, isConnected: false }};
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    shows: showsReducer,
    session: sessionReducer
});
