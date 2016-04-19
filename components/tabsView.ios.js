'use strict';

import React, { Component, TabBarIOS } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabIds } from '../constants';
import Routes from '../routes';
import { selectTab, MovieActions, ShowsActions, SessionActions } from '../actions';
import TabNavigator from './tabNavigator';
import Player from './player';

class TabsView extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        // load all video data from storage
        this.props.getMovies();
        this.props.getShows();
        this.props.updateSession();
    }
    render() {
        const { selectedTab, selectTab, session } = this.props;
        return (
            <TabBarIOS
                tintColor="red"
                barTintColor="white">
                <Icon.TabBarItemIOS
                    iconName="film"
                    title="Movies"
                    selected={selectedTab === TabIds.MOVIES_TAB}
                    onPress={() => selectTab(TabIds.MOVIES_TAB)}>
                    <TabNavigator initialRoute={Routes.movies} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="tv"
                    title="Shows"
                    selected={selectedTab === TabIds.SHOWS_TAB}
                    onPress={() => selectTab(TabIds.SHOWS_TAB)}>
                    <TabNavigator initialRoute={Routes.shows} />
                </Icon.TabBarItemIOS>
                {/*<Icon.TabBarItemIOS
                    iconName="pencil"
                    title="Edit"
                    selected={selectedTab === TabIds.EDIT_TAB}
                    onPress={() => selectTab(TabIds.EDIT_TAB)}>
                    <Text>Edit tab</Text>
                </Icon.TabBarItemIOS>*/}
                {session.movieId || session.episodeId
                    ? <Icon.TabBarItemIOS
                        iconName="youtube-play"
                        title="Now Playing"
                        selected={selectedTab === TabIds.NOW_PLAYING_TAB}
                        onPress={() => selectTab(TabIds.NOW_PLAYING_TAB)}>
                        <Player />
                    </Icon.TabBarItemIOS>
                    : null
                }
            </TabBarIOS>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedTab: state.selectedTab,
        session: state.session.data
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        selectTab,
        getMovies: MovieActions.get,
        getShows: ShowsActions.get,
        updateSession: SessionActions.update
     }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsView);
