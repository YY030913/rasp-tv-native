import React, { Component, View, Text, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { togglePause } from '../actions';
import PlayerControl from './playerControl';
import PlayPauseControl from './playPauseControl';

class Player extends Component {
    constructor(props) {
        super(props);

        this.getVideoTitle = this.getVideoTitle.bind(this);
    }
    getVideoTitle() {
        const { nowPlaying } = this.props;
        if (nowPlaying.movie) return nowPlaying.movie.title;
        if (nowPlaying.episode) return nowPlaying.epsiode.title;
        throw new Error('No movie or episode to create title but this component was re rendered');
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.getVideoTitle()}</Text>
                </View>
                <View style={styles.controlContainer}>
                    <PlayerControl name="fast-backward" />
                    <PlayerControl name="backward" />
                    <PlayerControl name="stop" />
                    <PlayPauseControl isPaused={this.props.nowPlaying.isPaused} onPress={this.props.togglePause} />
                    <PlayerControl name="forward" />
                    <PlayerControl name="fast-forward" />
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
    return bindActionCreators({togglePause}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
