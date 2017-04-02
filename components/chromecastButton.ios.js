import React, { Component } from 'react';
import { TouchableOpacity, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getChromecast from '../chromecast';

const chromecast = getChromecast();

export default class ChromecastButton extends Component {
    state = {
        devices: [],
        selectedDevice: null
    }
    componentDidMount() {
        this._deviceListChanged = chromecast.onDeviceListChanged(data => this.setState({ devices: data.Devices }));
    }
    componentWillUnmount() {
        this._deviceListChanged.remove();
    }
    _showActionSheet = () => {
        const buttons = [...this.state.devices, 'Disconnect', 'Cancel'];
        const cancelIndex = buttons.length - 1;
        const disconnectIndex = buttons.length - 2;
        ActionSheetIOS.showActionSheetWithOptions({
            options: buttons,
            cancelButtonIndex: cancelIndex,
            destructiveButtonIndex: disconnectIndex
        }, index => {
            if (index === disconnectIndex) {
                this.setState({ selectedDevice: null });
                chromecast.disconnect();
            } else if (index !== cancelIndex) {
                const device = buttons[index];
                this.setState({ selectedDevice: device });
                chromecast.connect(device);
            }
        });
    }
    render() {
        let iconName = 'cast';
        if (this.state.selectedDevice !== null) {
            iconName = 'cast-connected';
        }

        return (
            <TouchableOpacity onPress={this._showActionSheet} style={this.props.style}>
                <Icon name={iconName} size={this.props.size || 26} />
            </TouchableOpacity>
        );
    }
}
