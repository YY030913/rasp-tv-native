import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Slider } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import getChromecast from '../chromecast';
import Routes from '../routes';
import { PlayerActions, selectTab } from '../actions';
import { TabIds, BASE_URL } from '../constants';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';
import ChromecastButton from './chromecastButton';

const chromecast = getChromecast();

class Player extends Component {
    constructor(props) {
        super(props);

        this.getVideoTitle = this.getVideoTitle.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.stopPlaying = this.stopPlaying.bind(this);
        this.seek = this.seek.bind(this);
    }
    componentWillUpdate(newProps) {
        const movieChanged = this.props.session.movieId !== newProps.session.movieId;
        const episodeChanged = this.props.session.episodeId !== newProps.session.episodeId;
        if ((movieChanged || episodeChanged) && this.props.session.isPlaying
            && !newProps.session.isPlaying
            && newProps.selectedDevice !== null) {
            newProps.stop();
        }
    }
    getVideoTitle() {
        const { session } = this.props;
        if (session.movieId) {
            const movie = _.find(this.props.movies, m => m.id === session.movieId);
            return movie.title;
        }

        if (session.episodeId) {
            // we'll see how this goes... Would get slow when the library grows
            for (let s of this.props.shows) {
                const episode = _.find(s.episodes, e => e.id === session.episodeId);
                if (episode)
                    return `${s.title} - Season ${episode.season} - ${episode.title}`;
            }
        }

        throw new Error('No movie or episode to create title but this component was re rendered');
    }
    playOrPause() {
        const { session, toggle, playMovie, playEpisode, selectedDevice } = this.props;

        if (selectedDevice === null) {
            Alert.alert('Error', 'No device is selected');
            return;
        }

        if (session.movieId && !session.isPlaying) {
            playMovie(`${BASE_URL}/movies/${session.movieId}/stream`, this.getVideoTitle(), session.movieId);
            return;
        } else if (session.episodeId && !session.isPlaying) {
            playEpisode(`${BASE_URL}/shows/episodes/${session.episodeId}/stream`, this.getVideoTitle(), session.episodeId);
            return;
        }

        if (session.isPaused) {
            chromecast.play();
        } else {
            chromecast.pause();
        }
        toggle();
    }
    stopPlaying() {
        const { session, selectTab, stop, clear } = this.props;
        if (session.isPlaying) {
            stop();
        }

        clear();
        selectTab(TabIds.MOVIES_TAB);
    }
    seek(position) {
        this.props.updatePosition(position);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.chromecastContainer}>
                    <ChromecastButton onPress={() => this.props.navigator.push(Routes.deviceSelect)} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.getVideoTitle()}</Text>
                </View>
                <View style={styles.controlContainer}>
                    <PlayerControl name="stop" onPress={this.stopPlaying} />
                    <PlayPauseControl isPaused={this.props.session.isPaused} onPress={this.playOrPause} />
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
    chromecastContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
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
        selectedDevice: state.session.data.selectedDevice,
        position: state.session.data.position,
        duration: state.session.data.duration
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
        selectTab: tabId => dispatch(selectTab(tabId)),
        stop: () => {
            dispatch(PlayerActions.stop());
            chromecast.stop();
        },
        clear: () => dispatch(PlayerActions.clear()),
        updatePosition: position => dispatch(PlayerActions.updatePosition(position))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
