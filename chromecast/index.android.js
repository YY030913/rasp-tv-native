import { NativeModules, NativeAppEventEmitter } from 'react-native';
import { mapRawSession } from '../helpers';
const { ChromecastManager } = NativeModules;

export const {
    CAST_STATE_CONNECTED,
    CAST_STATE_CONNECTING,
    CAST_STATE_NO_DEVICES_AVAILABLE,
    CAST_STATE_NOT_CONNECTED,
    pause,
    play,
    stop,
    getStreamPosition,
    seekToTime
} = ChromecastManager;

export function getCurrentSession() {
    return ChromecastManager.getCurrentSession().then(newSession => mapRawSession(newSession));
}

export function startCasting(videoUrl, title, movieId, episodeId) {
    ChromecastManager.castVideo(videoUrl, title, movieId, episodeId, 'http://simongeeks.com/static/cast.jpg');
}

export function onMediaChanged(cb) {
    return NativeAppEventEmitter.addListener('MediaStatusUpdated', session => cb(mapRawSession(session)));
}

export function onCastStateChanged(cb) {
    return NativeAppEventEmitter.addListener('CastStateChanged', cb);
}
