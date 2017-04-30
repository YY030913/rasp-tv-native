import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getMovies } from './actions/movies';
import { getShows } from './actions/shows';
import { updateSession } from './actions/player';
import * as chromecast from './chromecast';

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

export function withChromecastMonitoring(Inner) {
    class ChromecastMonitor extends Component {
        componentDidMount() {
            const { session } = this.props;
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
                    this.props.updateSession(newSession);
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

    return connect(mapStateToProps, { updateSession })(ChromecastMonitor);
}

export function mapRawSession(session) {
    if (session === null) {
        return null;
    }

    const newSession = {
        duration: session.Duration,
        position: session.Position,
        isPlaying: session.IsPlaying,
        isPaused: session.IsPaused
    };

    if (session.MovieId !== 0) {
        newSession.movieId = session.MovieId;
        newSession.episodeId = null;
    } else if (session.EpisodeId !== 0) {
        newSession.episodeId = session.EpisodeId;
        newSession.movieId = null;
    }
    return newSession;
}

export function withMoviesAndShows(Inner) {
    class MoviesAndShowsInjector extends Component {
        componentDidMount() {
            this.props.getMovies();
            this.props.getShows();
        }
        render() {
            const { movies, shows } = this.props;
            if (movies.length === 0 || shows.length === 0) {
                return null;
            }

            return <Inner {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {
            movies: state.movies.data,
            shows: state.shows.data
        };
    }

    return connect(mapStateToProps, { getMovies, getShows })(MoviesAndShowsInjector);
}
