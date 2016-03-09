import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadingMovies, gotMovies } from '../actions';

class MovieList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moviesDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1.id !== r2.id
            })
        };

        this.fetchMovies = this.fetchMovies.bind(this);
    }
    componentWillMount() {
        this.fetchMovies();
    }
    componentWillReceiveProps(newProps) {
        this.setState({moviesDataSource: this.state.moviesDataSource.cloneWithRows(newProps.movies)});
    }
    fetchMovies() {
        this.props.loadingMovies();
        this.props.gotMovies();
    }
    renderMovie(movie) {
        return (
            <TouchableOpacity style={styles.movieRow}>
                <Text style={styles.movieRowText}>{movie.title}</Text>
            </TouchableOpacity>
        );
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

        const refresher = (
            <RefreshControl
                onRefresh={this.fetchMovies}
                refreshing={isLoading}
            />
        );

        return (
            <ListView
                style={styles.container}
                dataSource={this.state.moviesDataSource}
                renderRow={this.renderMovie}
                refreshControl={refresher}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
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
