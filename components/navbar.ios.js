import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavigationBar from 'react-native-navbar';
import { withRouter } from 'react-router';
import ChromecastButton from './chromecastButton';

function getTitle(path) {
    if (path === '/' || path.startsWith('/movies')) {
        return 'Movies';
    } else if (path.startsWith('/shows')) {
        return 'Shows';
    }

    return '';
}

const ChromecastNavButton = () => (
    <View style={styles.navBarButtonContainer}>
        <ChromecastButton style={styles.chromecastBtn} />
    </View>
);

const NavBar = ({ location, history }) => {
    return (
        <NavigationBar
            title={{title: location.pathname}}
            leftButton={{ title: 'Back', handler: () => history.goBack() }}
            rightButton={<ChromecastNavButton />}
        />
    );
};

const styles = StyleSheet.create({
    navBarButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    chromecastBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});

export default withRouter(NavBar);
