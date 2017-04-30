export const ActionTypes = {
    GET_MOVIES_PENDING: 'GET_MOVIES_PENDING',
    GET_MOVIES_FINISHED: 'GET_MOVIES_FINISHED',
    SELECT_TAB: 'SELECT_TAB',
    SELECT_MOVIE: 'SELECT_MOVIE',
    TOGGLE_PAUSE: 'TOGGLE_PAUSE',
    PLAY: 'PLAY',
    STOP: 'STOP',
    CLEAR_NOW_PLAYING: 'CLEAR_NOW_PLAYING',
    GET_SHOWS_PENDING: 'GET_SHOWS_PENDING',
    GET_SHOWS_FINISHED: 'GET_SHOWS_FINISHED',
    SELECT_EPISODE: 'SELECT_EPISODE',
    UPDATE_SESSION_PENDING: 'UPDATE_SESSION_PENDING',
    UPDATE_SESSION_FINISHED: 'UPDATE_SESSION_FINISHED',
    UPDATE_POSITION: 'UPDATE_POSITION',
    UPDATE_DURATION: 'UPDATE_DURATION',
    UPDATE_SESSION: 'UPDATE_SESSION',
    CONNECT_TO_DEVICE: 'CONNECT_TO_DEVICE',
    DISCONNECT_FROM_DEVICE: 'DISCONNECT_FROM_DEVICE'
};

export const PlayerCommands = {
    TOGGLE: 0,
    BACKWARD: 1,
    FORWARD: 2,
    STOP: 3,
    FASTBACKWARD: 4,
    FASTFORWARD: 5
};

export const BASE_URL = 'http://192.168.11.16:8080';
