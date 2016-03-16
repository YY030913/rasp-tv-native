import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchBar from './searchBar';
import { loadingMovies, gotMovies } from '../actions';
import Player from './player';

class MovieList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            moviesDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1.id !== r2.id
            })
        };

        this.fetchMovies = this.fetchMovies.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.renderSearchBar = this.renderSearchBar.bind(this);
    }
    componentWillMount() {
        this.fetchMovies();
    }
    componentWillReceiveProps(newProps) {
        if (this.props.movies !== newProps.movies) {
            this.setState({moviesDataSource: this.state.moviesDataSource.cloneWithRows(newProps.movies)});
        }
    }
    fetchMovies() {
        this.props.loadingMovies();
        this.props.gotMovies();
    }
    renderMovie(movie) {
        const { navigator } = this.props;
        const route = {component: Player, title: movie.title, passProps: {title: movie.title}};
        return (
            <TouchableOpacity style={styles.movieRow} onPress={() => navigator.push(route)}>
                <Text style={styles.movieRowText}>{movie.title}</Text>
            </TouchableOpacity>
        );
    }
    handleSearchTextChange(newText) {
        if (!newText.length) {
            this.setState({
                searchText: newText,
                moviesDataSource: this.state.moviesDataSource.cloneWithRows(this.props.movies)
            });
            return;
        }

        const regex = new RegExp(newText, 'i');
        const filteredMovies = this.props.movies.filter(m => regex.test(m.title));
        this.setState({
            searchText: newText,
            moviesDataSource: this.state.moviesDataSource.cloneWithRows(filteredMovies)
        });
    }
    renderSearchBar() {
        return <SearchBar value={this.state.searchText} onChangeText={this.handleSearchTextChange} />;
    }
    render() {
        const { isLoading } = this.props;
        if (isLoading) {
            return (
                <View style={styles.loadingView}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        const platformSpecificProps = {};
        if (Platform.OS === 'ios') {
            platformSpecificProps.title = 'Loading';
        }

        const refresher = (
            <RefreshControl
                onRefresh={this.fetchMovies}
                refreshing={isLoading}
                {...platformSpecificProps}
            />
        );

        return (
            <ListView
                style={styles.container}
                dataSource={this.state.moviesDataSource}
                renderRow={this.renderMovie}
                renderHeader={this.renderSearchBar}
                refreshControl={refresher}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    movieRow: {
        margin: 20
    },
    movieRowText: {
        fontSize: 15,
        textAlign: 'left'
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapStateToProps(state) {
    return {
        movies: state.movies.data,
        isLoading: state.movies.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadingMovies, gotMovies }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
