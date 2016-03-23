import React from 'react-native';
import PlayerControl from './playerControl';

const PlayPauseControl = ({isPaused, ...otherProps}) => {
    return (
        <PlayerControl
            name={isPaused ? 'play' : 'pause'}
            {...otherProps} />
    );
};

export default PlayPauseControl;
