import { Alert } from 'react-native';
import { PlayerCommands } from './constants';

function request(url, hasBody) {
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => {
                    throw new Error(data.error);
                });
            }

            if (hasBody) return res.json();
        })
        .catch(err => Alert.alert('Error', err.message || err));
}

// const baseUrl = 'http://192.168.11.2:8080';
const baseUrl = 'http://localhost:3000';

function runCommand(command) {
    return request(`${baseUrl}/player/command/${command}`, false);
}

export default {
    getMovies: () => {
        return request(`${baseUrl}/movies?isIndexed=true`, true);
    },
    getShows: () => {
        return request(`${baseUrl}/shows?all=true`, true);
    },
    playMovie: (id) => {
        return request(`${baseUrl}/movies/${id}/play`, false);
    },
    toggle: runCommand.bind(null, PlayerCommands.TOGGLE),
    fastBackward: runCommand.bind(null, PlayerCommands.FASTBACKWARD),
    backward: runCommand.bind(null, PlayerCommands.BACKWARD),
    stop: runCommand.bind(null, PlayerCommands.STOP),
    forward: runCommand.bind(null, PlayerCommands.FORWARD),
    fastForward: runCommand.bind(null, PlayerCommands.FASTFORWARD)
};
