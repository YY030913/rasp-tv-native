import React from 'react';
import PlayerControl from './playerControl';

const PlayPauseControl = ({isPaused, ...otherProps}) => {
    return (
        <PlayerControl
            name={isPaused ? 'play' : 'pause'}
            {...otherProps}
        />
    );
};

export default PlayPauseControl;
