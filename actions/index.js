import { ActionTypes } from '../constants';
import api from '../api';

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
    stop: async () => {
        const action = {type: ActionTypes.STOP};
        try {
            await api.stop();
        } catch(e) {
            action.error = e;
        }
        return action;
    },
    playVideo: basicAction.bind(null, ActionTypes.PLAY),
    clear: basicAction.bind(null, ActionTypes.CLEAR_NOW_PLAYING)
};

export const SessionActions = {
    update: () => {
        return dispatch => {
            dispatch({type: ActionTypes.UPDATE_SESSION_PENDING});

            const action = {type: ActionTypes.UPDATE_SESSION_FINISHED};
            api.getSession().then(session => {
                action.session = session;
                dispatch(action);
            })
            .catch(err => {
                action.error = err;
                dispatch(action);
            });
        };
    },
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
    clearDevice: () => {
        return {
            type: ActionTypes.CLEAR_SELECTED_DEVICE
        };
    }
};

export function selectTab(tab) {
    return {
        type: ActionTypes.SELECT_TAB,
        selectedTab: tab
    };
}
