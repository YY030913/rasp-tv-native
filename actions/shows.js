import { ActionTypes } from '../constants';
import * as api from '../api';

export function getShows() {
    return async dispatch => {
        dispatch({type: ActionTypes.GET_SHOWS_PENDING});
        const action = {type: ActionTypes.GET_SHOWS_FINISHED};
        try {
            const shows = await api.getShows();
            action.shows = shows;
        } catch (e) {
            action.error = e;
        }
        dispatch(action);
    };
}

export function selectEpisode(episodeId) {
    return {
        type: ActionTypes.SELECT_EPISODE,
        episodeId
    };
}
