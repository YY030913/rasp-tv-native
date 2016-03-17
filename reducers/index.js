import { combineReducers } from 'redux';
import { ActionTypes, TabIds } from '../constants';

function moviesReducer(state = {data: [], isLoading: false}, action) {
    switch(action.type) {
        case ActionTypes.LOADING_MOVIES:
            return {...state, isLoading: true};
        case ActionTypes.GOT_MOVIES:
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

function nowPlayingReducer(state = null, action) {
    switch (action.type) {
        case ActionTypes.NOW_PLAYING:
            return action.video;
    }

    return state;
}

export default combineReducers({
    movies: moviesReducer,
    selectedTab: selectedTabReducer,
    nowPlaying: nowPlayingReducer
});
