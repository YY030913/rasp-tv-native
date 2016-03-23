import { PlayerCommands } from './constants';

const baseUrl = 'http://192.168.11.2:8080';
function runCommand(command) {
    return fetch(`${baseUrl}/player/command/${command}`);
}

export default {
    getMovies: () => {
        return fetch(`${baseUrl}/movies`)
            .then(res => res.json())
            .then(data => {
                return data.sort((a, b) => a.title.localeCompare(b.title));
            });
    },
    playMovie: (id) => {
        return fetch(`${baseUrl}/movies/${id}/play`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
            });
    },
    toggle: runCommand.bind(null, PlayerCommands.TOGGLE),
    fastBackward: runCommand.bind(null, PlayerCommands.FASTBACKWARD),
    backward: runCommand.bind(null, PlayerCommands.BACKWARD),
    stop: runCommand.bind(null, PlayerCommands.STOP),
    forward: runCommand.bind(null, PlayerCommands.FORWARD),
    fastForward: runCommand.bind(null, PlayerCommands.FASTFORWARD)
};
