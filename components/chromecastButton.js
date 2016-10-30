import React from 'react';
import { Text, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChromecastButton = ({clearDevice, selectDevice, selectedDevice, devices}) => {
    function showActionSheet() {
        const buttons = [...devices, 'Disconnect', 'Cancel'];
        const cancelIndex = buttons.length - 1;
        const disconnectIndex = buttons.length - 2;
        ActionSheetIOS.showActionSheetWithOptions({
            options: buttons,
            cancelButtonIndex: cancelIndex,
            destructiveButtonIndex: disconnectIndex
        }, index => {
            if (index === disconnectIndex) {
                clearDevice();
                return;
            } else if (index !== cancelIndex) {
                selectDevice(buttons[index]);
            }
        });
    }

    const buttonState = {text: 'Connect Chromecast', color: '#dce4e4'};
    if (selectedDevice !== null) {
        buttonState.text = `Connected to ${selectedDevice}`;
        buttonState.color = '#3084ba';
    }

    return (
        <Icon.Button name="chrome" backgroundColor={buttonState.color} onPress={showActionSheet}>
            <Text>{buttonState.text}</Text>
        </Icon.Button>
    );
};

export default ChromecastButton;
