import MoviesContainer from './components/moviesContainer';
import ShowsContainer from './components/showsContainer';
import SeasonsList from './components/seasonsList';
import EpisodesList from './components/episodesList';
import Player from './components/player';

export default {
    movies: {component: MoviesContainer, title: 'Movies'},
    shows: {component: ShowsContainer, title: 'Shows'},
    seasons: {component: SeasonsList, title: 'Seasons'},
    episodes: {component: EpisodesList, title: 'Episodes'},
    player: {component: Player, title: 'Now Playing'}
};
