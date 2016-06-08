import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const NavButton = ({text, onPress}) => {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <Text style={styles.rowText}>{text}</Text>
        </TouchableOpacity>
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
