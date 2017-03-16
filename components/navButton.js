import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';

const NavButton = ({ text, to, onPress: preOnPress }) => {
    return (
        <Link to={to} component={({ onPress }) => (
            <TouchableOpacity style={styles.row} onPress={() => {
                if (preOnPress) {
                    preOnPress();
                }
                onPress();
            }}>
                <Text style={styles.rowText}>{text}</Text>
            </TouchableOpacity>
        )} />
    );
};

const styles = StyleSheet.create({
    row: {
        margin: 20
    },
    rowText: {
        fontSize: 15,
        textAlign: 'left'
    }
});

export default NavButton;
