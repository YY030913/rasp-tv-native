import { ActionTypes } from '../constants';

function basicAction(type) {
    return {
        type
    };
}

export const toggle = basicAction.bind(null, ActionTypes.TOGGLE_PAUSE);
export const stop = basicAction.bind(null, ActionTypes.STOP);
export const playVideo = basicAction.bind(null, ActionTypes.PLAY);
export const clear = basicAction.bind(null, ActionTypes.CLEAR_NOW_PLAYING);
export function updatePosition(position) {
    return {
        type: ActionTypes.UPDATE_POSITION,
        position
    };
}

export function updateDuration(duration) {
    return {
        type: ActionTypes.UPDATE_DURATION,
        duration
    };
}

export function updateSession(session) {
    return {
        type: ActionTypes.UPDATE_SESSION,
        session
    };
}
