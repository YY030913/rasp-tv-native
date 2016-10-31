import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FilterableList from './filterableList';
import NavButton from './navButton';
import { MovieActions, selectTab } from '../actions';
import { TabIds } from '../constants';
import GlobalStyles from '../globalStyles';

class MovieList extends Component {
    constructor(props) {
        super(props);

        this.fetchMovies = this.fetchMovies.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
    }
    componentWillMount() {
        this.fetchMovies();
    }
    fetchMovies(bustCache) {
        this.props.getMovies(bustCache);
    }
    renderMovie(movie) {
        const playAndSwitchTab = () => {
            this.props.selectMovie(movie.id);
            this.props.selectTab(TabIds.NOW_PLAYING_TAB);
        };

        return <NavButton text={movie.title} onPress={playAndSwitchTab} />;
    }
    render() {
        const { isLoading, movies } = this.props;
        return (
            <FilterableList
                hasChangedKey="id"
                items={movies}
                filterByKey="title"
                isLoading={isLoading}
                renderRow={this.renderMovie}
                onRefresh={this.fetchMovies.bind(null, true)}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        movies: state.movies.data,
        isLoading: state.movies.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        getMovies: MovieActions.get,
        selectMovie: MovieActions.select,
        selectTab
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
