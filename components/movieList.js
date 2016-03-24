import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FilterableList from './filterableList';
import { MovieActions, selectTab } from '../actions';
import { TabIds } from '../constants';

class MovieList extends Component {
    constructor(props) {
        super(props);

        this.fetchMovies = this.fetchMovies.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
    }
    componentWillMount() {
        this.fetchMovies();
    }
    fetchMovies() {
        this.props.loadingMovies();
        this.props.gotMovies();
    }
    renderMovie(movie) {
        const playAndSwitchTab = () => {
            this.props.selectMovie(movie);
            this.props.selectTab(TabIds.NOW_PLAYING_TAB);
        };

        return (
            <TouchableOpacity style={styles.movieRow} onPress={playAndSwitchTab}>
                <Text style={styles.movieRowText}>{movie.title}</Text>
            </TouchableOpacity>
        );
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
                onRefresh={this.fetchMovies}
            />
        );
    }
}

const styles = StyleSheet.create({
    movieRow: {
        margin: 20
    },
    movieRowText: {
        fontSize: 15,
        textAlign: 'left'
    }
});

function mapStateToProps(state) {
    return {
        movies: state.movies.data,
        isLoading: state.movies.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    const bindings = {
        loadingMovies: MovieActions.loading,
        gotMovies: MovieActions.get,
        selectMovie: MovieActions.select,
        selectTab
    };

    return bindActionCreators(bindings, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
