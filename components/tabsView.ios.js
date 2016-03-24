'use strict';

import React, {
    Component,
    Text,
    TabBarIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabIds } from '../constants';
import { selectTab } from '../actions';
import TabNavigator from './tabNavigator';
import MovieList from './movieList';
import ShowsList from './showsList';
import Player from './player';

class TabsView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { selectedTab, selectTab, nowPlaying } = this.props;
        return (
            <TabBarIOS
                tintColor="red"
                barTintColor="white">
                <Icon.TabBarItemIOS
                    iconName="film"
                    title="Movies"
                    selected={selectedTab === TabIds.MOVIES_TAB}
                    onPress={() => selectTab(TabIds.MOVIES_TAB)}>
                    <TabNavigator initialRoute={{component: MovieList, title: 'Movies'}} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="tv"
                    title="Shows"
                    selected={selectedTab === TabIds.SHOWS_TAB}
                    onPress={() => selectTab(TabIds.SHOWS_TAB)}>
                    <TabNavigator initialRoute={{component: ShowsList, title: 'Shows'}} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="pencil"
                    title="Edit"
                    selected={selectedTab === TabIds.EDIT_TAB}
                    onPress={() => selectTab(TabIds.EDIT_TAB)}>
                    <Text>Edit tab</Text>
                </Icon.TabBarItemIOS>
                {nowPlaying.movie || nowPlaying.episode
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
        nowPlaying: state.nowPlaying
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ selectTab }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsView);
