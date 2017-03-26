import React from 'react';
import { TabBarIOS, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Route, Switch } from 'react-router-native';
import NavBar from './navbar';
import MoviesContainer from './moviesContainer';
import ShowsContainer from './showsContainer';
import SeasonsList from './seasonsList';
import EpisodesList from './episodesList';
import Player from './player';
import { withChromecastMonitoring } from '../helpers';

const TabsView = ({ session, history, location }) => {
    const playerProps = {
        iconName: 'youtube-play',
        title: 'Now Playing',
        selected: location.pathname.endsWith('play')
    };

    let playerTab;
    if (session.movieId) {
        playerTab = (
            <Icon.TabBarItemIOS
                {...playerProps}
                onPress={() => history.push(`/movies/${session.movieId}/play`)}>
                <Route exact path="/:type/:movieId/play" component={Player} />
            </Icon.TabBarItemIOS>
        );
    } else if (session.episodeId) {
        playerTab = (
            <Icon.TabBarItemIOS
                {...playerProps}
                onPress={() => history.push(`/episodes/${session.episodeId}/play`)}>
                <Route exact path="/:type/:episodeId/play" component={Player} />
            </Icon.TabBarItemIOS>
        );
    }

    return (
        <View style={styles.container}>
            <NavBar />
            <TabBarIOS
                tintColor="red"
                barTintColor="white">
                <Icon.TabBarItemIOS
                    iconName="film"
                    title="Movies"
                    selected={location.pathname === '/'}
                    onPress={() => history.push('/')}>
                    <Route exact path="/" component={MoviesContainer} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="tv"
                    title="Shows"
                    selected={location.pathname.startsWith('/shows')}
                    onPress={() => history.push('/shows')}>
                    <Switch>
                        <Route exact path="/shows" component={ShowsContainer} />
                        <Route exact path="/shows/:showId/seasons" component={SeasonsList} />
                        <Route exact path="/shows/:showId/seasons/:season/episodes" component={EpisodesList} />
                    </Switch>
                </Icon.TabBarItemIOS>
                {playerTab}
            </TabBarIOS>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default withChromecastMonitoring(TabsView);
