import React, { Component } from 'react';
import { View, Text, StyleSheet, Slider, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withMoviesAndShows } from '../helpers';
import * as chromecast from '../chromecast';
import * as PlayerActions from '../actions/player';
import { selectMovie } from '../actions/movies';
import { selectEpisode } from '../actions/shows';
import { BASE_URL } from '../constants';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

const isAndroid = Platform.OS === 'android';
const LARGE_SEEK = isAndroid ? 120000 : 120;
const SMALL_SEEK = isAndroid ? 30000 : 30;

class Player extends Component {
    componentDidMount() {
        const { isConnected } = this.props;
        if (!isConnected) {
            return;
        }

        chromecast.getCurrentSession().then(newSession => {
            if (newSession !== null && newSession.isPlaying) {
                this.observeStreamPosition();
            } else {
                // nothing is currently playing
                return;
            }

            const { match } = this.props;
            const id = parseInt(match.params.id, 10);
            const movieChanged = match.params.type === 'movies' && id !== newSession.movieId;
            const episodeChanged = match.params.type === 'episodes' && id !== newSession.episodeId;
            if ((movieChanged || episodeChanged) && newSession.isPlaying) {
                this.stopObservingStreamPosition();
                this.props.stop();
            }
        });
    }
    // componentWillUpdate(newProps) {
    //     const movieChanged = this.props.session.movieId !== newProps.session.movieId;
    //     const episodeChanged = this.props.session.episodeId !== newProps.session.episodeId;
    //     if ((movieChanged || episodeChanged) && this.props.session.isPlaying
    //         && !newProps.session.isPlaying
    //         && newProps.isConnected) {
    //         newProps.stop();
    //     }
    // }
    componentWillUnmount() {
        this.stopObservingStreamPosition();
    }
    getVideoTitle = () => {
        const { match } = this.props;
        if (match.params.type === 'movies') {
            const movieId = parseInt(match.params.id);
            const movie = _.find(this.props.movies, m => m.id === movieId);
            return movie.title;
        }

        if (match.params.type === 'episodes') {
            const episodeId = parseInt(match.params.id);
            // we'll see how this goes... Would get slow when the library grows
            for (let s of this.props.shows) {
                const episode = _.find(s.episodes, e => e.id === episodeId);
                if (episode)
                    return `${s.title} - Season ${episode.season} - ${episode.title}`;
            }
        }

        throw new Error('No movie or episode to create title but this component was re rendered');
    }
    observeStreamPosition = () => {
        this._positionInterval = setInterval(() => {
            chromecast.getStreamPosition(this.props.updatePosition);
        }, 1000);
    }
    stopObservingStreamPosition = () => {
        clearInterval(this._positionInterval);
    }
    playOrPause = () => {
        const { session, toggle, playMovie, playEpisode, isConnected, match } = this.props;
        if (!isConnected) {
            Alert.alert('Error', 'Not connected to Chromecast');
            return;
        }

        if (match.params.type === 'movies' && !session.isPlaying) {
            const movieId = parseInt(match.params.id, 10);
            playMovie(`${BASE_URL}/movies/${movieId}/stream`, this.getVideoTitle(), movieId);
            this.observeStreamPosition();
            return;
        } else if (match.params.type === 'episodes' && !session.isPlaying) {
            const episodeId = parseInt(match.params.id, 10);
            playEpisode(`${BASE_URL}/shows/episodes/${episodeId}/stream`, this.getVideoTitle(), episodeId);
            this.observeStreamPosition();
            return;
        }

        if (session.isPaused) {
            chromecast.play();
            this.observeStreamPosition();
        } else {
            chromecast.pause();
            this.stopObservingStreamPosition();
        }
        toggle();
    }
    stopPlaying = () => {
        const { session, stop, clear, history, match } = this.props;
        if (session.isPlaying) {
            stop();
        }

        clear();
        this.stopObservingStreamPosition();

        if (match.params.type === 'episodes') {
            history.replace('/shows');
        } else {
            history.replace('/');
        }
    }
    seek = (position) => {
        this.props.updatePosition(position);
        chromecast.seekToTime(position);
    }
    seekForward = (factor) => {
        const { position, duration } = this.props;
        this.seek(Math.min(position + factor, duration));
    }
    seekBackward = (factor) => {
        const { position } = this.props;
        this.seek(Math.max(position - factor, 0));
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.getVideoTitle()}</Text>
                </View>
                <View style={styles.controlContainer}>
                    <PlayerControl name="fast-backward" onPress={() => this.seekBackward(LARGE_SEEK)} />
                    <PlayerControl name="backward" onPress={() => this.seekBackward(SMALL_SEEK)} />
                    <PlayerControl name="stop" onPress={this.stopPlaying} />
                    <PlayPauseControl isPaused={this.props.session.isPaused} onPress={this.playOrPause} />
                    <PlayerControl name="forward" onPress={() => this.seekForward(SMALL_SEEK)} />
                    <PlayerControl name="fast-forward" onPress={() => this.seekForward(LARGE_SEEK)} />
                </View>
                <View style={styles.sliderContainer}>
                    <Slider value={this.props.position}
                        disabled={this.props.duration === 0}
                        maximumValue={this.props.duration}
                        onSlidingComplete={this.seek}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2
    },
    titleContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderContainer: {
        flex: 1,
        marginBottom: 60,
        marginHorizontal: 5
    },
    controlContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold'
    }
});

function mapStateToProps(state) {
    return {
        session: state.session.data,
        isLoading: state.session.isLoading,
        position: state.session.data.position,
        duration: state.session.data.duration,
        isConnected: state.session.data.isConnected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggle: () => dispatch(PlayerActions.toggle()),
        playMovie: (url, title, id) => {
            dispatch(selectMovie(id));
            dispatch(PlayerActions.playVideo());
            chromecast.startCasting(url, title, id, 0);
        },
        playEpisode: (url, title, id) => {
            dispatch(selectEpisode(id));
            dispatch(PlayerActions.playVideo());
            chromecast.startCasting(url, title, 0, id);
        },
        stop: () => {
            dispatch(PlayerActions.stop());
            chromecast.stop();
        },
        clear: () => dispatch(PlayerActions.clear()),
        updatePosition: position => dispatch(PlayerActions.updatePosition(position)),
    };
}

export default withMoviesAndShows(connect(mapStateToProps, mapDispatchToProps)(Player));
