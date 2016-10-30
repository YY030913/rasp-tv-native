import { Platform, NativeModules, NativeAppEventEmitter } from 'react-native';

function createChromecastIOS() {
    const { ChromecastManager } = NativeModules;
    return {
        startScanner: () => ChromecastManager.startScan(),
        stopScanner: () => ChromecastManager.stopScan(),
        connect: deviceName => {
            ChromecastManager.connectToDevice(deviceName);
        },
        disconnect: () => {
            ChromecastManager.disconnect();
        },
        pause: () => {
            ChromecastManager.pause();
        },
        play: () => {
            ChromecastManager.play();
        },
        stop: () => {
            ChromecastManager.stop();
        },
        startCasting: (videoUrl, title, movieId, episodeId) => {
            ChromecastManager.castVideo(videoUrl, title, movieId, episodeId, 'http://simongeeks.com/static/cast.jpg');
        },
        onDeviceListChanged: cb => {
            return NativeAppEventEmitter.addListener('DeviceListChanged', cb);
        },
        onMediaChanged: cb => {
            return NativeAppEventEmitter.addListener('MediaStatusUpdated', cb);
        },
        getStreamPosition: cb => {
            ChromecastManager.getStreamPosition(cb);
        },
        seekToTime: position => {
            ChromecastManager.seekToTime(position);
        }
    };
}

function createNativeChromecastModule() {
    // if (__DEV__) {
    //     return createFakeChromecast();
    // }

    if (Platform.OS === 'ios') {
        return createChromecastIOS();
    }

    throw new Error(`Chromecast not implemented for ${Platform.OS}`);
}

export default createNativeChromecastModule;
