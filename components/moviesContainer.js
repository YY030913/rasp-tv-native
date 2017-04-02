import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMovies, selectMovie } from '../actions/movies';
import MovieList from './movieList';

class MoviesContainer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getMovies();
    }
    render() {
        return <MovieList {...this.props} />;
    }
}

function mapStateToProps(state) {
    return {
        movies: state.movies.data,
        isLoading: state.movies.isLoading
    };
}

export default connect(mapStateToProps, { getMovies, selectMovie })(MoviesContainer);
