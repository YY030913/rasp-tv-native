import { Alert, AsyncStorage } from 'react-native';
import { PlayerCommands, BASE_URL } from './constants';

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
        const headers = {
            'Cache-Control': 'no-cache'
        };
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error);
        }

        if (hasBody && res.headers.get('Content-Length') !== '0')
            return res.json();
    } catch (err) {
        Alert.alert('Error', err.message || err);
        throw err;
    }
}

function runCommand(command) {
    return request(`${BASE_URL}/player/command/${command}`, false);
}

export function getMovies(bustCache) {
    return request(`${BASE_URL}/movies?isIndexed=true`, true);
    // const storageKey = 'movies';
    // const getAndStore = async () => {
    //     const movies = await request(`${BASE_URL}/movies?isIndexed=true`, true);
    //     await storage(storageKey, movies);
    //     return movies;
    // };
    //
    // if (bustCache) {
    //     return await getAndStore();
    // } else {
    //     const data = await storage(storageKey);
    //     if (data === null) {
    //         return await getAndStore();
    //     }
    //
    //     return data;
    // }
}

export function getShows(bustCache) {
    return request(`${BASE_URL}/shows?all=true`, true);
    // const storageKey = 'shows';
    // const getAndStore = async () => {
    //     const shows = await request(`${BASE_URL}/shows?all=true`, true);
    //     await storage(storageKey, shows);
    //     return shows;
    // };
    //
    // if (bustCache) {
    //     return await getAndStore();
    // } else {
    //     const data = await storage(storageKey);
    //     if (data === null) {
    //         return await getAndStore();
    //     }
    //
    //     return data;
    // }
}

export function playMovie(id) {
    return request(`${BASE_URL}/movies/${id}/play`, false);
}

export function playEpisode(id) {
    return request(`${BASE_URL}/shows/episodes/${id}/play`, false);
}

export function getSession() {
    return request(`${BASE_URL}/player/session`, true);
}

export const toggle = runCommand.bind(null, PlayerCommands.TOGGLE);
export const fastBackward = runCommand.bind(null, PlayerCommands.FASTBACKWARD);
export const backward = runCommand.bind(null, PlayerCommands.BACKWARD);
export const stop = runCommand.bind(null, PlayerCommands.STOP);
export const forward = runCommand.bind(null, PlayerCommands.FORWARD);
export const fastForward = runCommand.bind(null, PlayerCommands.FASTFORWARD);
