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
        startCasting: (videoUrl, title) => {
            ChromecastManager.castVideo(videoUrl, title, 'Video', 'http://simongeeks.com/static/cast.jpg');
        },
        onDeviceListChanged: cb => {
            return NativeAppEventEmitter.addListener('DeviceListChanged', cb);
        },
        onMediaChanged: cb => {
            return NativeAppEventEmitter.addListener('MediaStatusUpdated', cb);
        }
    };
}

function createNativeChromecastModule() {
    // if (__DEV__) {
    //
    // }
    if (Platform.OS === 'ios') {
        return createChromecastIOS();
    }

    throw new Error(`Chromecast not implemented for ${Platform.OS}`);
}

export default createNativeChromecastModule;
