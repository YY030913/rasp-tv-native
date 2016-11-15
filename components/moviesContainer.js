import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectTab, MovieActions } from '../actions';
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        selectTab,
        getMovies: MovieActions.get,
        selectMovie: MovieActions.select,
     }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesContainer);
