import React, { Component } from 'react';
import { View, Text, StyleSheet, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Routes from '../routes';
import { PlayerActions, selectTab } from '../actions';
import { TabIds, BASE_URL } from '../constants';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';
import ChromecastButton from './chromecastButton';

const { ChromecastManager } = NativeModules;

class Player extends Component {
    constructor(props) {
        super(props);

        this.getVideoTitle = this.getVideoTitle.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.stopPlaying = this.stopPlaying.bind(this);
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
        const { session, toggle, playVideo } = this.props;

        if (session.movieId && !session.isPlaying) {
            playVideo(`${BASE_URL}/movies/${session.movieId}/stream`, this.getVideoTitle());
            return;
        } else if (session.episodeId && !session.isPlaying) {
            playVideo(`${BASE_URL}/movies/${session.movieId}/stream`, this.getVideoTitle());
            return;
        }

        if (session.isPaused) {
            ChromecastManager.play();
        } else {
            ChromecastManager.pause();
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        padding: 2
    },
    chromecastContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 2
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlContainer: {
        flex: 1.5,
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
        shows: state.shows.data,
        movies: state.movies.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggle: () => dispatch(PlayerActions.toggle()),
        playVideo: (url, title) => {
            dispatch(PlayerActions.playVideo());
            ChromecastManager.castVideo(url, title, "Video", "http://simongeeks.com/static/cast.jpg");
        },
        selectTab: (tabId) => dispatch(selectTab(tabId)),
        stop: () => {
            dispatch(PlayerActions.stop());
            ChromecastManager.stop();
        },
        clear: () => dispatch(PlayerActions.clear())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
