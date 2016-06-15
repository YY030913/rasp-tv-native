import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

const ChromecastButton = ({onPress, selectedDevice}) => {
    const buttonState = {text: 'Connect Chromecast', color: '#dce4e4'};
    if (selectedDevice !== null) {
        buttonState.text = `Connected to ${selectedDevice}`;
        buttonState.color = '#3084ba';
    }

    return (
        <Icon.Button name="chrome" backgroundColor={buttonState.color} onPress={onPress}>
            <Text>{buttonState.text}</Text>
        </Icon.Button>
    );
};

function mapStateToProps(state) {
    return {
        selectedDevice: state.session.data.selectedDevice
    };
}

export default connect(mapStateToProps)(ChromecastButton);
