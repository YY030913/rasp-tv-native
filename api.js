import { Alert, AsyncStorage } from 'react-native';
import { PlayerCommands } from './constants';

async function storage(key, value) {
    if (value) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return;
    }

    const data = await AsyncStorage.getItem(key);
    return data === null ? null : JSON.parse(data);
}

async function request(url, hasBody) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error);
        }

        if (hasBody && res.headers.get('Content-Length') !== '0')
            return await res.json();
    } catch (err) {
        Alert.alert('Error', err.message || err);
        throw err;
    }
}

const baseUrl = 'http://192.168.11.2:8080';
// const baseUrl = 'http://localhost:3000';

function runCommand(command) {
    return request(`${baseUrl}/player/command/${command}`, false);
}

export default {
    getMovies: async (bustCache) => {
        const storageKey = 'movies';
        const getAndStore = async () => {
            const movies = await request(`${baseUrl}/movies?isIndexed=true`, true);
            await storage(storageKey, movies);
            return movies;
        };

        if (bustCache) {
            return await getAndStore();
        } else {
            const data = await storage(storageKey);
            if (data === null) {
                return await getAndStore();
            }

            return data;
        }
    },
    getShows: async (bustCache) => {
        const storageKey = 'shows';
        const getAndStore = async () => {
            const shows = await request(`${baseUrl}/shows?all=true`, true);
            await storage(storageKey, shows);
            return shows;
        };

        if (bustCache) {
            return await getAndStore();
        } else {
            const data = await storage(storageKey);
            if (data === null) {
                return await getAndStore();
            }

            return data;
        }
    },
    playMovie: (id) => {
        return request(`${baseUrl}/movies/${id}/play`, false);
    },
    playEpisode: (id) => {
        return request(`${baseUrl}/shows/episodes/${id}/play`, false);
    },
    getSession: () => {
        return request(`${baseUrl}/player/session`, true);
    },
    toggle: runCommand.bind(null, PlayerCommands.TOGGLE),
    fastBackward: runCommand.bind(null, PlayerCommands.FASTBACKWARD),
    backward: runCommand.bind(null, PlayerCommands.BACKWARD),
    stop: runCommand.bind(null, PlayerCommands.STOP),
    forward: runCommand.bind(null, PlayerCommands.FORWARD),
    fastForward: runCommand.bind(null, PlayerCommands.FASTFORWARD)
};
