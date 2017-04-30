import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Route, Switch } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateSession, connect as connectDevice, disconnect } from '../actions/player';
import MoviesContainer from './moviesContainer';
import ShowsContainer from './showsContainer';
import SeasonsList from './seasonsList';
import EpisodesList from './episodesList';
import Player from './player';
import ChromecastButton from './chromecastButton';
import * as chromecast from '../chromecast';

const baseActions = [
    { title: 'Movies', iconName: 'film', show: 'always', showWithText: true },
    { title: 'Shows', iconName: 'tv', show: 'always', showWithText: true }
];

class TabsView extends Component {
    state = {
        index: 0,
        actions: baseActions
    }
    componentDidMount() {
        const updateSessionFromCast = (newSession) => {
            console.log('updateSessionFromCast', newSession);
            if (newSession === null || newSession.duration === -1) {
                return;
            }

            const { session } = this.props;
            newSession.isPlaying = true; // we always want this set here?
            if (!_.isEqual(session, newSession)) {
                this.props.updateSession(newSession);
            }
        };

        chromecast.getCurrentSession().then(updateSessionFromCast);
        this._mediaChanged = chromecast.onMediaChanged(updateSessionFromCast);
        this._onCastStateChanged = chromecast.onCastStateChanged(data => {
            switch (data.state) {
                case chromecast.CAST_STATE_CONNECTED:
                    this.props.connectDevice();
                    break;
                case chromecast.CAST_STATE_NOT_CONNECTED:
                    this.props.disconnect();
                    break;
            }
        });
    }
    componentWillReceiveProps({ session, location }) {
        if (session.movieId || session.episodeId) {
            this.setState({ actions: [...baseActions, { title: 'Now Playing', iconName: 'youtube-play', show: 'always', showWithText: true }] });
        } else if (this.state.actions.length === 3) {
            this.setState({ actions: [...baseActions] });
        }

        const oldPath = this.props.location.pathname;
        const newPath = location.pathname;
        if (oldPath !== newPath) {
            if (newPath.endsWith('play')) {
                this.setState({ index: 2 });
            } else {
                const oldBase = oldPath.split('/')[1];
                const newBase = newPath.split('/')[1];
                if (oldBase !== newBase) {
                    // check if we should update the tab when the route changes
                    if (!newBase && newPath === '/') {
                        this.setState({ index: 0 });
                    } else if (newBase === 'shows') {
                        this.setState({ index: 1 });
                    }
                }
            }
        }
    }
    componentWillUnmount() {
        this._onCastStateChanged.remove();
        this._mediaChanged.remove();
    }
    _onTabChange = (index) => {
        switch (index) {
            case 0:
                this.props.history.push('/');
                break;
            case 1:
                this.props.history.push('/shows');
                break;
            case 2: {
                const { session } = this.props;
                let path;
                if (session.movieId) {
                    path = `/movies/${session.movieId}/play`;
                } else if (session.episodeId) {
                    path = `/episodes/${session.episodeId}/play`;
                }
                this.props.history.push(path);
                break;
            }
        }
        this.setState({ index });
    }
    _renderScene = (index) => {
        switch (index) {
            case 0:
                return <Route exact path="/" component={MoviesContainer} />;
            case 1:
                return (
                    <Switch>
                        <Route exact path="/shows" component={ShowsContainer} />
                        <Route exact path="/shows/:showId/seasons" component={SeasonsList} />
                        <Route exact path="/shows/:showId/seasons/:season/episodes" component={EpisodesList} />
                    </Switch>
                );
            case 2:
                return <Route exact path="/:type/:id/play" component={Player} />;
            default:
                throw new Error('Invalid index ' + index);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbarContainer}>
                    <Icon.ToolbarAndroid
                        style={styles.toolbar}
                        actions={this.state.actions}
                        navIconName="chevron-left"
                        onActionSelected={this._onTabChange}
                        onIconClicked={() => this.props.history.goBack()}
                    />
                    <View style={styles.chromecastBtnContainer}>
                        <ChromecastButton style={styles.chromecastBtn} />
                    </View>
                </View>
                {this._renderScene(this.state.index)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbarContainer: {
        height: 60,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#0da1eb',
        marginBottom: 2
    },
    toolbar: {
        flex: 6,
    },
    chromecastBtnContainer: {
        flex: 1,
        marginTop: 1
    },
    chromecastBtn: {
        flex: 1
    }
});

function mapStateToProps(state) {
    return {
        session: state.session.data
    };
}

export default connect(mapStateToProps, { updateSession, connectDevice, disconnect })(TabsView);
