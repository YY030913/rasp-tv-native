import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

export default class MovieList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moviesDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            loaded: false
        };

        this.fetchMovies = this.fetchMovies.bind(this);
    }
    componentWillMount() {
        this.fetchMovies();
    }
    fetchMovies() {
        this.setState({loaded: false});
        fetch('http://192.168.11.2:8080/movies')
            .then(res => res.json())
            .then(data => {
                const sortedMovies = data.sort((a, b) => a.title.localeCompare(b.title));
                this.setState({
                    moviesDataSource: this.state.moviesDataSource.cloneWithRows(sortedMovies),
                    loaded: true
                });
            })
            .done();
    }
    renderMovie(movie) {
        return (
            <TouchableOpacity>
                <View style={styles.movieRow}>
                    <Text style={styles.movieRowText}>{movie.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        if (this.state.loaded === false) {
            return <Text>Loading...</Text>;
        }

        return (
            <ListView
                style={styles.container}
                dataSource={this.state.moviesDataSource}
                renderRow={this.renderMovie}
                refreshControl={
                    <RefreshControl
                        onRefresh={this.fetchMovies}
                        refreshing={!this.state.loaded}
                    />
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    movieRow: {
        margin: 20
    },
    movieRowText: {
        fontSize: 15,
        textAlign: 'left'
    }
});
