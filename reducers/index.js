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

const defaultSession = {
    movieId: null,
    episodeId: null,
    isPlaying: false,
    isPaused: true
};

function sessionReducer(state = {data: defaultSession, isLoading: false}, action) {
    switch (action.type) {
        case ActionTypes.SELECT_MOVIE:
            return {...state, data: {...defaultSession, movieId: action.movieId}};
        case ActionTypes.SELECT_EPISODE:
            return {...state, data: {...defaultSession, episodeId: action.episodeId}};
        case ActionTypes.TOGGLE_PAUSE:
            return {...state, data: {...state.data, isPaused: !state.data.isPaused}};
        case ActionTypes.PLAY:
            return {...state, data: {...state.data, isPlaying: true, isPaused: false}};
        case ActionTypes.CLEAR_NOW_PLAYING:
            return {data: defaultSession, isLoading: false};
        case ActionTypes.STOP:
            return {...state, data: {...state.data, isPlaying: false}};
        case ActionTypes.UPDATE_SESSION_PENDING:
            return {...state, isLoading: true};
        case ActionTypes.UPDATE_SESSION_FINISHED: {
            if (!action.session) {
                return {...state, isLoading: false};
            }

            const { movieId, episodeId, isPlaying, isPaused} = action.session;
            return {
                data: {
                    movieId,
                    episodeId,
                    isPlaying,
                    isPaused
                },
                isLoading: false
            };
        }
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    shows: showsReducer,
    selectedTab: selectedTabReducer,
    session: sessionReducer
});
