import { ActionTypes } from '../constants';
import api from '../api';

function basicAction(type) {
    return {
        type
    };
}

export const MovieActions = {
    loading: basicAction.bind(null, ActionTypes.GET_MOVIES_PENDING),
    get: async (bustCache) => {
        const action = {type: ActionTypes.GET_MOVIES_FINISHED};
        try {
            const movies = await api.getMovies(bustCache);
            action.movies = movies;
        } catch (err) {
            action.error = err;
        }
        return action;
    },
    select: (movie) => {
        return {
            type: ActionTypes.SELECT_MOVIE,
            movie
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
    loading: basicAction.bind(null, ActionTypes.GET_SHOWS_PEDNDING),
    get: async (bustCache) => {
        const action = {type: ActionTypes.GET_SHOWS_FINISHED};
        try {
            const shows = await api.getShows(bustCache);
            action.shows = shows;
        } catch (e) {
            action.error = e;
        }
        return action;
    },
    select: (episode) => {
        return {
            type: ActionTypes.SELECT_EPISODE,
            episode
        };
    },
    play: async (id) => {
        const action = {type: ActionTypes.PLAY};
        try {
            await api.playEpisode(id);
        } catch (e) {
            action.error = e;
        }
        return action;
    }
};

export const PlayerActions = {
    toggle: () => {
        const action = {type: ActionTypes.TOGGLE_PAUSE};
        return api.toggle()
            .then(() => action);
    },
    stop: () => {
        const action = {type: ActionTypes.STOP};
        return api.stop()
            .then(() => action);
    },
    clear: basicAction.bind(null, ActionTypes.CLEAR_NOW_PLAYING)
};

export function selectTab(tab) {
    return {
        type: ActionTypes.SELECT_TAB,
        selectedTab: tab
    };
}
