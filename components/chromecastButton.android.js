import { requireNativeComponent, View } from 'react-native';

const iface = {
    name: 'ChromecastButton',
    propTypes: {
        ...View.propTypes
    }
};

export default requireNativeComponent('ChromecastButtonManager', iface);
