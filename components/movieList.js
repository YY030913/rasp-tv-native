import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';

const MovieList = ({ isLoading, movies,  selectMovie, getMovies }) => {
    return (
        <FilterableList
            hasChangedKey="id"
            items={movies}
            filterByKey="title"
            isLoading={isLoading}
            renderRow={movie => <NavButton text={movie.title} to={`/movies/${movie.id}/play`} onPress={() => selectMovie(movie.id)} />}
            onRefresh={() => getMovies(true)}
        />
    );
};

export default MovieList;
