import React, { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayerControl = ({onPress, ...otherProps}) => {
    return (
        <TouchableOpacity style={styles.control} activeOpacity={0.4} onPress={onPress}>
            <Icon {...otherProps} size={26} />
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
