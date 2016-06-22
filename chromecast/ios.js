import { NativeModules, NativeAppEventEmitter } from 'react-native';

const { ChromecastManager } = NativeModules;

export default {
    startScanner: () => ChromecastManager.startScan(),
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
