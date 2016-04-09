import MovieList from './components/movieList';
import ShowsList from './components/showsList';
import SeasonsList from './components/seasonsList';
import EpisodesList from './components/episodesList';

export default {
    movies: {component: MovieList, title: 'Movies'},
    shows: {component: ShowsList, title: 'Shows'},
    seasons: {component: SeasonsList, title: 'Seasons'},
    episodes: {component: EpisodesList, title: 'Episodes'}
};