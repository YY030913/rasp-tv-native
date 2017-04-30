import { NativeModules, NativeAppEventEmitter } from 'react-native';
const { ChromecastManager } = NativeModules;

export const {
    disconnect,
    pause,
    play,
    stop,
    getStreamPosition,
    seekToTime
} = ChromecastManager;

export function startScanner() {
    ChromecastManager.startScan();
}

export function stopScanner() {
    ChromecastManager.stopScan();
}

export function connect(deviceName) {
    ChromecastManager.connectToDevice(deviceName);
}

export function startCasting(videoUrl, title, movieId, episodeId) {
    ChromecastManager.castVideo(videoUrl, title, movieId, episodeId, 'http://simongeeks.com/static/cast.jpg');
}

export function onDeviceListChanged(cb) {
    return NativeAppEventEmitter.addListener('DeviceListChanged', cb);
}

export function onMediaChanged(cb) {
    return NativeAppEventEmitter.addListener('MediaStatusUpdated', cb);
}
