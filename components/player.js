import React, { Component, View, Text, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import api from '../api';
import { MovieActions, ShowsActions, PlayerActions} from '../actions';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

class Player extends Component {
    constructor(props) {
        super(props);

        this.getVideoTitle = this.getVideoTitle.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.stopPlaying = this.stopPlaying.bind(this);
    }
    componentWillReceiveProps(newProps) {
        const oldNowPlaying = this.props.session;
        const newNowPlaying = newProps.session;

        const newMovieSelected = oldNowPlaying.movie === null
            && newNowPlaying.movie !== null
            && newNowPlaying.episode === null;
        const newEpisodeSelected = oldNowPlaying.episode === null
            && newNowPlaying.episode !== null
            && newNowPlaying.movie === null;
        const movieHasChanged = oldNowPlaying.movie !== null
            && newNowPlaying.movie !== null
            && oldNowPlaying.movie.id !== newNowPlaying.movie.id;
        const episodeHasChanged = oldNowPlaying.episode !== null
            && newNowPlaying.episode !== null
            && oldNowPlaying.episode.id !== newNowPlaying.episode.id;

        if (newMovieSelected || newEpisodeSelected || movieHasChanged || episodeHasChanged) {
            newProps.stopVideo();
        }
    }
    getVideoTitle() {
        const { session } = this.props;
        if (session.movie) return session.movie.title;
        if (session.episode) {
            const show = _.find(this.props.shows, s => s.id === session.episode.showId);
            return `${show.title} - Season ${session.episode.season} - ${session.episode.title}`;
        }
        throw new Error('No movie or episode to create title but this component was re rendered');
    }
    playOrPause() {
        const { session } = this.props;

        if (session.movie && !session.isPlaying) {
            this.props.playMovie(session.movie.id);
            return;
        } else if (session.episode && !session.isPlaying) {
            this.props.playEpisode(session.episode.id);
            return;
        }

        this.props.togglePause();
    }
    stopPlaying() {
        const { session } = this.props;

        if (session.isPlaying) {
            this.props.stopVideo();
            this.props.clearNowPlaying();
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
                    <PlayPauseControl isPaused={this.props.session.isPaused} onPress={this.playOrPause} />
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
        session: state.session,
        shows: state.shows.data
    };
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        togglePause: PlayerActions.toggle,
        playMovie: MovieActions.play,
        playEpisode: ShowsActions.play,
        stopVideo: PlayerActions.stop,
        clearNowPlaying: PlayerActions.clear
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
