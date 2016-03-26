import { ActionTypes } from '../constants';
import api from '../api';

function basicAction(type) {
    return {
        type
    };
}

export const MovieActions = {
    loading: basicAction.bind(null, ActionTypes.GET_MOVIES_PENDING),
    get: () => {
        const action = {type: ActionTypes.GET_MOVIES_FINISHED};
        return api.getMovies().then(movies => {
            action.movies = movies;
            return action;
        });
    },
    select: (movie) => {
        return {
            type: ActionTypes.SELECT_MOVIE,
            movie
        };
    },
    play: (id) => {
        const action = {type: ActionTypes.PLAY};
        return api.playMovie(id)
            .then(() => action);
    }
};

export const ShowsActions = {
    loading: basicAction.bind(null, ActionTypes.GET_SHOWS_PEDNDING),
    get: () => {
        const action = {type: ActionTypes.GET_SHOWS_FINISHED};
        return api.getShows().then(shows => {
            action.shows = shows;
            return action;
        });
    },
    select: (episode) => {
        return {
            type: ActionTypes.SELECT_EPISODE,
            episode
        };
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
