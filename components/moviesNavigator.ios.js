import React, { NavigatorIOS, Component, StyleSheet } from 'react-native';
import MovieList from './movieList';

export default class MoviesNavigator extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <NavigatorIOS
                style={styles.container}
                initialRoute={{component: MovieList, title: 'Movies'}}
                itemWrapperStyle={styles.navContent}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navContent: {
        marginTop: 60,
        marginBottom: 40
    }
});
