import React from 'react';
import NavigationBar from 'react-native-navbar';
import { withRouter } from 'react-router';

function getTitle(path) {
    if (path === '/' || path.startsWith('/movies')) {
        return 'Movies';
    } else if (path.startsWith('/shows')) {
        return 'Shows';
    }

    return '';
}

const NavBar = ({ location, history }) => {
    return (
        <NavigationBar
            title={{title: location.pathname}}
            leftButton={{ title: 'Back', handler: () => history.goBack() }}
        />
    );
};

export default withRouter(NavBar);
