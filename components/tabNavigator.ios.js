import React, { NavigatorIOS, StyleSheet } from 'react-native';

const TabNavigator = ({initialRoute}) => {
    return (
        <NavigatorIOS
            style={styles.container}
            initialRoute={initialRoute}
            itemWrapperStyle={styles.navContent}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navContent: {
        marginTop: 65,
        marginBottom: 35
    }
});

export default TabNavigator;
