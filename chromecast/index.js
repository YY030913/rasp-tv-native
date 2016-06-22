import { Platform } from 'react-native';

function createNativeChromecastModule() {
    if (Platform.OS === 'ios') {
        return require('./ios');
    }

    throw new Error(`Chromecast not implemented for ${Platform.OS}`);
}

export default createNativeChromecastModule;
