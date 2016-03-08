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
                rowHasChanged: (r1, r2) => r1.id !== r2.id
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
            <TouchableOpacity style={styles.movieRow}>
                <Text style={styles.movieRowText}>{movie.title}</Text>
            </TouchableOpacity>
        );
    }
    render() {
        if (this.state.loaded === false) {
            return (
                <View style={styles.loadingView}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        const refresher = (
            <RefreshControl
                onRefresh={this.fetchMovies}
                refreshing={!this.state.loaded}
            />
        );

        return (
            <ListView
                style={styles.container}
                dataSource={this.state.moviesDataSource}
                renderRow={this.renderMovie}
                refreshControl={refresher}
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
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
