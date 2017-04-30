import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connect as connectDevice, disconnect } from '../actions/player';
import { TouchableOpacity, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as chromecast from '../chromecast';

class ChromecastButton extends Component {
    state = {
        devices: []
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
                chromecast.disconnect();
                this.props.disconnect();
            } else if (index !== cancelIndex) {
                const device = buttons[index];
                chromecast.connect(device);
                this.props.connectDevice();
            }
        });
    }
    render() {
        let iconName = 'cast';
        if (this.props.isConnected) {
            iconName = 'cast-connected';
        }

        return (
            <TouchableOpacity onPress={this._showActionSheet} style={this.props.style}>
                <Icon name={iconName} size={this.props.size || 26} />
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) {
    return {
        isConnected: state.session.data.isConnected
    };
}

export default connect(mapStateToProps, { connectDevice, disconnect })(ChromecastButton);
