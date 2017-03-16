import { ActionTypes } from '../constants';
import * as api from '../api';

function basicAction(type) {
    return {
        type
    };
}

export const MovieActions = {
    get: (bustCache) => {
        return dispatch => {
            dispatch({type: ActionTypes.GET_MOVIES_PENDING});

            const action = {type: ActionTypes.GET_MOVIES_FINISHED};
            api.getMovies(bustCache).then(movies => {
                action.movies = movies;
                dispatch(action);
            })
            .catch(err => {
                action.error = err;
                dispatch(action);
            });
        };
    },
    select: (movieId) => {
        return {
            type: ActionTypes.SELECT_MOVIE,
            movieId
        };
    },
    play: async (id) => {
        const action = {type: ActionTypes.PLAY};
        try {
            await api.playMovie(id);
        } catch (e) {
            action.error = e;
        }
        return action;
    }
};

export const ShowsActions = {
    get: (bustCache) => {
        return dispatch => {
            dispatch({type: ActionTypes.GET_SHOWS_PENDING});

            const action = {type: ActionTypes.GET_SHOWS_FINISHED};
            api.getShows(bustCache).then(shows => {
                action.shows = shows;
                dispatch(action);
            })
            .catch(err => {
                action.error = err;
                dispatch(action);
            });
        };
    },
    select: (episodeId) => {
        return {
            type: ActionTypes.SELECT_EPISODE,
            episodeId
        };
    }
};

export const PlayerActions = {
    toggle: basicAction.bind(null, ActionTypes.TOGGLE_PAUSE),
    stop: basicAction.bind(null, ActionTypes.STOP),
    playVideo: basicAction.bind(null, ActionTypes.PLAY),
    clear: basicAction.bind(null, ActionTypes.CLEAR_NOW_PLAYING),
    updatePosition: (position) => {
        return {
            type: ActionTypes.UPDATE_POSITION,
            position
        };
    },
    updateDuration: (duration) => {
        return {
            type: ActionTypes.UPDATE_DURATION,
            duration
        };
    },
    updateSession: session => {
        return {
            type: ActionTypes.UPDATE_SESSION,
            session
        };
    }
};

export const SessionActions = {
    setDevices: (devices) => {
        return {
            type: ActionTypes.SET_DEVICES,
            devices
        };
    },
    selectDevice: (device) => {
        return {
            type: ActionTypes.SELECT_DEVICE,
            device
        };
    },
    clearDevice: basicAction.bind(null, ActionTypes.CLEAR_SELECTED_DEVICE)
};
