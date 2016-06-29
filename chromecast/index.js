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

function createFakeChromecast() {
    const noop = function(){};
    const fakeEvent = () => {
        return {
            remove: noop
        };
    };
    return {
        startScanner: noop,
        stopScanner: noop,
        connect: deviceName => {
            noop();
        },
        disconnect: noop,
        pause: noop,
        play: noop,
        stop: noop,
        startCasting: (videoUrl, title) => {
            noop();
        },
        onDeviceListChanged: cb => {
            return fakeEvent();
        },
        onMediaChanged: cb => {
            return fakeEvent();
        }
    };
}

function createNativeChromecastModule() {
    if (__DEV__) {
        return createFakeChromecast();
    }
    
    if (Platform.OS === 'ios') {
        return createChromecastIOS();
    }

    throw new Error(`Chromecast not implemented for ${Platform.OS}`);
}

export default createNativeChromecastModule;
