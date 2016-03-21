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
                name={isPaused ? 'play' : 'pause'}
                {...otherProps} />
        );
    }
}
