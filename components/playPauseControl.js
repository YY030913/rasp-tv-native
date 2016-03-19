import React, { Component } from 'react-native';
import PlayerControl from './playerControl';

export default class PlayPauseControl extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { isPaused, ...otherProps } = this.props;
        return (
            <PlayerControl
                source={isPaused ? require('../icons/Play.png') : require('../icons/Pause.png')}
                {...otherProps} />
        );
    }
}
