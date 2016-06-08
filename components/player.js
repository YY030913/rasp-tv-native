import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import api from '../api';
import { MovieActions, ShowsActions, PlayerActions, SessionActions, selectTab } from '../actions';
import { TabIds } from '../constants';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

class Player extends Component {
    constructor(props) {
        super(props);

        this.poll = this.poll.bind(this);
        this.getVideoTitle = this.getVideoTitle.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.stopPlaying = this.stopPlaying.bind(this);
    }
    poll() {
        this.props.dispatch(SessionActions.update());
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
    async playOrPause() {
        const { session, dispatch } = this.props;
        const oldSession = await api.getSession();
        if (oldSession && oldSession.isPlaying && !session.isPlaying) {
            await dispatch(PlayerActions.stop());
        }

        if (session.movieId && !session.isPlaying) {
            await dispatch(MovieActions.play(session.movieId));
            return;
        } else if (session.episodeId && !session.isPlaying) {
            await dispatch(ShowsActions.play(session.episodeId));
            return;
        }

        await dispatch(PlayerActions.toggle());
    }
    async stopPlaying() {
        const { session, dispatch } = this.props;

        if (session.isPlaying) {
            await dispatch(PlayerActions.stop());
            dispatch(PlayerActions.clear());
        } else {
            dispatch(PlayerActions.clear());
        }

        dispatch(selectTab(TabIds.MOVIES_TAB));
    }
    render() {
        const platformSpecificProps = {};
        if (Platform.OS === 'ios') {
            platformSpecificProps.title = 'Loading';
        }

        const refreshControl = (
            <RefreshControl
                onRefresh={this.poll}
                refreshing={this.props.isLoading}
                {...platformSpecificProps}
            />
        );

        return (
            <ScrollView contentContainerStyle={styles.container} refreshControl={refreshControl}>
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
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
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
        session: state.session.data,
        isLoading: state.session.isLoading,
        shows: state.shows.data,
        movies: state.movies.data
    };
}

export default connect(mapStateToProps)(Player);
