import React, { Component } from 'react';
import { View, Text, StyleSheet, Slider } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import getChromecast from '../chromecast';
import * as PlayerActions from '../actions/player';
import { BASE_URL } from '../constants';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

const chromecast = getChromecast();
const LARGE_SEEK = 120;
const SMALL_SEEK = 30;

class Player extends Component {
    componentWillUpdate(newProps) {
        const movieChanged = this.props.session.movieId !== newProps.session.movieId;
        const episodeChanged = this.props.session.episodeId !== newProps.session.episodeId;
        if ((movieChanged || episodeChanged) && this.props.session.isPlaying
            && !newProps.session.isPlaying
            && newProps.selectedDevice !== null) {
            newProps.stop();
        }
    }
    componentWillUnmount() {
        this.stopObservingStreamPosition();
    }
    getVideoTitle = () => {
        const { session, match } = this.props;
        if (match.params.type === 'movies' && session.movieId) {
            const movie = _.find(this.props.movies, m => m.id === session.movieId);
            return movie.title;
        }

        if (match.params.type === 'episodes' && session.episodeId) {
            // we'll see how this goes... Would get slow when the library grows
            for (let s of this.props.shows) {
                const episode = _.find(s.episodes, e => e.id === session.episodeId);
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
        const { session, toggle, playMovie, playEpisode } = this.props;

        if (session.movieId && !session.isPlaying) {
            playMovie(`${BASE_URL}/movies/${session.movieId}/stream`, this.getVideoTitle(), session.movieId);
            this.observeStreamPosition();
            return;
        } else if (session.episodeId && !session.isPlaying) {
            playEpisode(`${BASE_URL}/shows/episodes/${session.episodeId}/stream`, this.getVideoTitle(), session.episodeId);
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
    },
    slider: {
        height: 10
    }
});

function mapStateToProps(state) {
    return {
        session: state.session.data,
        isLoading: state.session.isLoading,
        shows: state.shows.data,
        movies: state.movies.data,
        position: state.session.data.position,
        duration: state.session.data.duration,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggle: () => dispatch(PlayerActions.toggle()),
        playMovie: (url, title, id) => {
            dispatch(PlayerActions.playVideo());
            chromecast.startCasting(url, title, id, 0);
        },
        playEpisode: (url, title, id) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Player);
