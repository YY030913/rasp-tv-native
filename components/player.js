import React, { Component, View, Text, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import api from '../api';
import { MovieActions, PlayerActions} from '../actions';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

class Player extends Component {
    constructor(props) {
        super(props);

        this.getVideoTitle = this.getVideoTitle.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.stopPlaying = this.stopPlaying.bind(this);
    }
    getVideoTitle() {
        const { nowPlaying } = this.props;
        if (nowPlaying.movie) return nowPlaying.movie.title;
        if (nowPlaying.episode) return nowPlaying.epsiode.title;
        throw new Error('No movie or episode to create title but this component was re rendered');
    }
    playOrPause() {
        const { nowPlaying } = this.props;

        if (nowPlaying.movie && !nowPlaying.isPlaying) {
            this.props.playMovie(nowPlaying.movie.id);
            return;
        } else if (nowPlaying.epsiode && !nowPlaying.isPlaying) {
            throw new Error('Playing episodes are not supported yet.');
        }

        this.props.togglePause();
    }
    stopPlaying() {
        const { nowPlaying } = this.props;

        if (nowPlaying.isPlaying) {
            this.props.stopVideo();
        } else {
            this.props.clearNowPlaying();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.getVideoTitle()}</Text>
                </View>
                <View style={styles.controlContainer}>
                    <PlayerControl name="fast-backward" onPress={api.fastBackward} />
                    <PlayerControl name="backward" onPress={api.backward} />
                    <PlayerControl name="stop" onPress={this.stopPlaying} />
                    <PlayPauseControl isPaused={this.props.nowPlaying.isPaused} onPress={this.playOrPause} />
                    <PlayerControl name="forward" onPress={api.forward} />
                    <PlayerControl name="fast-forward" onPress={api.fastForward} />
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
        nowPlaying: state.nowPlaying
    };
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        togglePause: PlayerActions.toggle,
        playMovie: MovieActions.play,
        stopVideo: PlayerActions.stop,
        clearNowPlaying: PlayerActions.clear
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
