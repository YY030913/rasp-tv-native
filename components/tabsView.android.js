import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Route, Switch } from 'react-router-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import MoviesContainer from './moviesContainer';
import ShowsContainer from './showsContainer';
import SeasonsList from './seasonsList';
import EpisodesList from './episodesList';

class TabsView extends Component {
    state = {
        index: 0,
        routes: [
            { key: 'movies', title: 'Movies' },
            { key: 'shows', title: 'Shows' }
        ],
        pathname: '/'
    }
    componentWillReceiveProps({ session, location }) {
        const oldPath = this.props.location.pathname;
        const newPath = location.pathname;
        if (oldPath !== newPath) {
            const newState = { pathname: newPath };
            const oldBase = oldPath.split('/')[1];
            const newBase = newPath.split('/')[1];
            if (oldBase !== newBase) {
                // check if we should update the tab when the route changes
                if (!newBase && newPath === '/') {
                    newState.index = 0;
                } else if (newBase === 'shows') {
                    newState.index = 1;
                }
            }
            this.setState(newState);
        }
    }
    _onTabChange = (index) => {
        switch (index) {
            case 0:
                this.props.history.push('/');
                break;
            case 1:
                this.props.history.push('/shows');
                break;
        }
        this.setState({ index });
    }
    _renderHeader = (props) => {
        return <TabBar {...props} />;
    }
    _renderScene({ route }) {
        switch (route.key) {
            case 'movies':
                return <Route exact path="/" component={MoviesContainer} />;
            case 'shows':
                return (
                    <Switch>
                        <Route exact path="/shows" component={ShowsContainer} />
                        <Route exact path="/shows/:showId/seasons" component={SeasonsList} />
                        <Route exact path="/shows/:showId/seasons/:season/episodes" component={EpisodesList} />
                    </Switch>
                );
        }
    }
    render() {
        return (
            <TabViewAnimated
                style={styles.container}
                navigationState={this.state}
                renderHeader={this._renderHeader}
                renderScene={this._renderScene}
                onRequestChangeTab={this._onTabChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TabsView;
