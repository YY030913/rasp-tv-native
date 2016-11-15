import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';
import { TabIds } from '../constants';

const MovieList = ({ isLoading, movies, selectTab, selectMovie, getMovies }) => {
    const playAndSwitchTab = movieId => {
        selectMovie(movieId);
        selectTab(TabIds.NOW_PLAYING_TAB);
    };

    return (
        <FilterableList
            hasChangedKey="id"
            items={movies}
            filterByKey="title"
            isLoading={isLoading}
            renderRow={movie => <NavButton text={movie.title} onPress={() => playAndSwitchTab(movie.id)} />}
            onRefresh={() => getMovies(true)}
        />
    );
};

export default MovieList;
