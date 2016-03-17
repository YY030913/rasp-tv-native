'use strict';

import React, {
    Component,
    Text,
    TabBarIOS
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabIds } from '../constants';
import { selectTab } from '../actions';
import MoviesNavigator from './moviesNavigator';
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
                <TabBarIOS.Item
                    icon={require('../icons/Movies.png')}
                    title="Movies"
                    selected={selectedTab === TabIds.MOVIES_TAB}
                    onPress={() => selectTab(TabIds.MOVIES_TAB)}>
                    <MoviesNavigator />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={require('../icons/Shows.png')}
                    title="Shows"
                    selected={selectedTab === TabIds.SHOWS_TAB}
                    onPress={() => selectTab(TabIds.SHOWS_TAB)}>
                    <Text>Shows tab</Text>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={require('../icons/Edit.png')}
                    title="Edit"
                    selected={selectedTab === TabIds.EDIT_TAB}
                    onPress={() => selectTab(TabIds.EDIT_TAB)}>
                    <Text>Edit tab</Text>
                </TabBarIOS.Item>
                {nowPlaying
                    ? <TabBarIOS.Item
                        icon={require('../icons/NowPlaying.png')}
                        title="Now Playing"
                        selected={selectedTab === TabIds.NOW_PLAYING_TAB}
                        onPress={() => selectTab(TabIds.NOW_PLAYING_TAB)}>
                        <Player title={nowPlaying.title} />
                    </TabBarIOS.Item>
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
