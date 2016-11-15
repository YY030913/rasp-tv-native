import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RandomButton = props => (
    <Icon.Button
        name="random"
        backgroundColor="white"
        color="black"
        onPress={props.onPress}
        style={[styles.container, props.style]}
    />
);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginHorizontal: 15,
        marginTop: 7,
        padding: 10,
        borderColor: '#c0c2b9',
        borderWidth: StyleSheet.hairlineWidth,
    }
});

export default RandomButton;
