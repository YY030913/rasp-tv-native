import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { SessionActions, PlayerActions } from './actions';
import getChromecast from './chromecast';

export function withLifecycleLogging(Inner, tag) {
    return class extends Component {
        componentDidMount() {
            console.log(`[${tag}] - componentDidMount`);
        }
        componentWillReceiveProps(newProps) {
            console.log(`[${tag}] - componentWillReceiveProps, ${Object.keys(newProps).join(', ')}`);
        }
        componentWillUnmount() {
            console.log(`[${tag}] - componentWillUnmount`);
        }
        render() {
            console.log('Render');
            return <Inner {...this.props} />;
        }
    };
}

const chromecast = getChromecast();
export function withChromecastMonitoring(Inner) {
    class ChromecastMonitor extends Component {
        componentDidMount() {
            const { session, updateSession } = this.props;
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
            return <Inner {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {
            session: state.session.data
        };
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            updateSession: PlayerActions.updateSession,
         }, dispatch);
    }

    return connect(mapStateToProps, mapDispatchToProps)(ChromecastMonitor);
}
