'use strict';

import React, { Component } from 'react';
import { TabBarIOS, AppState } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import getChromecast from '../chromecast';
import { TabIds } from '../constants';
import Routes from '../routes';
import { selectTab, MovieActions, ShowsActions, SessionActions, PlayerActions } from '../actions';
import TabNavigator from './tabNavigator';
const chromecast = getChromecast();

class TabsView extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        // load all video data from storage
        this.props.getMovies();
        this.props.getShows();

        const { setDevices, session, updateSession } = this.props;
        this._deviceListChanged = chromecast.onDeviceListChanged(data => setDevices(data.Devices));
        this._mediaChanged = chromecast.onMediaChanged(data => {
            // console.log(data);
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
                // console.log('session updated', newSession);
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
        const { selectedTab, selectTab, session } = this.props;
        return (
            <TabBarIOS
                tintColor="red"
                barTintColor="white">
                <Icon.TabBarItemIOS
                    iconName="film"
                    title="Movies"
                    selected={selectedTab === TabIds.MOVIES_TAB}
                    onPress={() => selectTab(TabIds.MOVIES_TAB)}>
                    <TabNavigator initialRoute={Routes.movies} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="tv"
                    title="Shows"
                    selected={selectedTab === TabIds.SHOWS_TAB}
                    onPress={() => selectTab(TabIds.SHOWS_TAB)}>
                    <TabNavigator initialRoute={Routes.shows} />
                </Icon.TabBarItemIOS>
                {/*<Icon.TabBarItemIOS
                    iconName="pencil"
                    title="Edit"
                    selected={selectedTab === TabIds.EDIT_TAB}
                    onPress={() => selectTab(TabIds.EDIT_TAB)}>
                    <Text>Edit tab</Text>
                </Icon.TabBarItemIOS>*/}
                {session.movieId || session.episodeId
                    ? <Icon.TabBarItemIOS
                        iconName="youtube-play"
                        title="Now Playing"
                        selected={selectedTab === TabIds.NOW_PLAYING_TAB}
                        onPress={() => selectTab(TabIds.NOW_PLAYING_TAB)}>
                        <TabNavigator initialRoute={Routes.player} />
                    </Icon.TabBarItemIOS>
                    : null
                }
            </TabBarIOS>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedTab: state.selectedTab,
        session: state.session.data
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        selectTab,
        getMovies: MovieActions.get,
        getShows: ShowsActions.get,
        setDevices: SessionActions.setDevices,
        updateSession: PlayerActions.updateSession
     }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsView);
