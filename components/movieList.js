import React from 'react';
import FilterableList from './filterableList';
import NavButton from './navButton';

const MovieList = ({ isLoading, movies, getMovies }) => {
    return (
        <FilterableList
            hasChangedKey="id"
            items={movies}
            filterByKey="title"
            isLoading={isLoading}
            renderRow={movie => <NavButton text={movie.title} to={`/movies/${movie.id}/play`} />}
            onRefresh={getMovies}
        />
    );
};

export default MovieList;
