import React, { Component } from 'react';
import { TabBarIOS, AppState, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Route, Switch } from 'react-router-native';
import { } from 'history/createMemoryHistory';
import NavBar from './navbar';
import getChromecast from '../chromecast';
import { SessionActions, PlayerActions } from '../actions';
import MoviesContainer from './moviesContainer';
import ShowsContainer from './showsContainer';
import SeasonsList from './seasonsList';
import EpisodesList from './episodesList';
import Player from './player';
const chromecast = getChromecast();

class TabsView extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { setDevices, session, updateSession } = this.props;
        this._deviceListChanged = chromecast.onDeviceListChanged(data => setDevices(data.Devices));
        this._mediaChanged = chromecast.onMediaChanged(data => {
            const newSession = {};
            if (data.IsPaused !== session.isPaused)
                newSession.isPaused = data.IsPaused;

            if (data.MovieId !== 0 && data.MovieId !== session.movieId) {
                newSession.movieId = data.MovieId;
                newSession.episodeId = null;
                newSession.duration = data.Duration;
                newSession.position = data.Position;
                newSession.isPlaying = true;
            } else if (data.EpisodeId !== 0 && data.EpisodeId !== session.episodeId) {
                newSession.episodeId = data.EpisodeId;
                newSession.movieId = null;
                newSession.duration = data.Duration;
                newSession.position = data.Position;
                newSession.isPlaying = true;
            }

            if (!_.isEmpty(newSession)) {
                updateSession(newSession);
            }
        });
        AppState.addEventListener('change', this._handleAppStateChange);
        chromecast.startScanner();
    }
    componentWillUnmount() {
        this._deviceListChanged.remove();
        this._mediaChanged.remove();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange(appState) {
        if (appState === 'background' || appState === 'inactive') {
            chromecast.stopScanner();
        } else {
            chromecast.startScanner();
        }
    }
    render() {
        const { session, history, location } = this.props;
        const playerProps = {
            iconName: 'youtube-play',
            title: 'Now Playing',
            selected: location.pathname.endsWith('play')
        };
        let playerTab;
        if (session.movieId) {
            playerTab = (
                <Icon.TabBarItemIOS
                    {...playerProps}
                    onPress={() => history.push(`/movies/${session.movieId}/play`)}>
                    <Route exact path="/:type/:movieId/play" component={Player} />
                </Icon.TabBarItemIOS>
            );
        } else if (session.episodeId) {
            playerTab = (
                <Icon.TabBarItemIOS
                    {...playerProps}
                    onPress={() => history.push(`/episodes/${session.episodeId}/play`)}>
                    <Route exact path="/:type/:episodeId/play" component={Player} />
                </Icon.TabBarItemIOS>
            );
        }

        return (
            <View style={styles.container}>
                <NavBar />
                <TabBarIOS
                    tintColor="red"
                    barTintColor="white">
                    <Icon.TabBarItemIOS
                        iconName="film"
                        title="Movies"
                        selected={location.pathname === '/'}
                        onPress={() => history.push('/')}>
                        <Route exact path="/" component={MoviesContainer} />
                    </Icon.TabBarItemIOS>
                    <Icon.TabBarItemIOS
                        iconName="tv"
                        title="Shows"
                        selected={location.pathname.startsWith('/shows')}
                        onPress={() => history.push('/shows')}>
                        <Switch>
                            <Route exact path="/shows" component={ShowsContainer} />
                            <Route exact path="/shows/:showId/seasons" component={SeasonsList} />
                            <Route exact path="/shows/:showId/seasons/:season/episodes" component={EpisodesList} />
                        </Switch>
                    </Icon.TabBarItemIOS>
                    {playerTab}
                </TabBarIOS>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

function mapStateToProps(state) {
    return {
        session: state.session.data
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setDevices: SessionActions.setDevices,
        updateSession: PlayerActions.updateSession,
     }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsView);
