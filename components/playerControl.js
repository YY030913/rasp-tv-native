import React, { TouchableOpacity, StyleSheet, Image } from 'react-native';

const PlayerControl = ({onPress, ...otherProps}) => {
    return (
        <TouchableOpacity style={styles.control} activeOpacity={0.4} onPress={onPress}>
            <Image {...otherProps} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    control: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c0c2b9',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 25,
        marginHorizontal: 1
    }
});

export default PlayerControl;
