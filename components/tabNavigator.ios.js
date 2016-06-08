import React from 'react';
import { NavigatorIOS, StyleSheet } from 'react-native';

const TabNavigator = ({initialRoute}) => {
    return (
        <NavigatorIOS
            style={styles.container}
            initialRoute={initialRoute}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TabNavigator;
