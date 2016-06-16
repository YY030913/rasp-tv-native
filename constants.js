export const TabIds = {
    MOVIES_TAB: 'MOVIES_TAB',
    SHOWS_TAB: 'SHOWS_TAB',
    EDIT_TAB: 'EDIT_TAB',
    NOW_PLAYING_TAB: 'NOW_PLAYING_TAB'
};

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
    SET_DEVICES: 'SET_DEVICES',
    SELECT_DEVICE: 'SELECT_DEVICE',
    CLEAR_SELECTED_DEVICE: 'CLEAR_SELECTED_DEVICE'
};

export const PlayerCommands = {
    TOGGLE: 0,
    BACKWARD: 1,
    FORWARD: 2,
    STOP: 3,
    FASTBACKWARD: 4,
    FASTFORWARD: 5
};

export const BASE_URL = 'http://192.168.11.2:8080';
