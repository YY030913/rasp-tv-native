'use strict';

import React, {
    AppRegistry,
    Component,
    Text,
    TabBarIOS
} from 'react-native';

import MovieList from './components/movieList';

const tabIds = {
    MOVIES_TAB: 'MOVIES_TAB',
    SHOWS_TAB: 'SHOWS_TAB',
    EDIT_TAB: 'EDIT_TAB'
};

class RaspTvNative extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: tabIds.MOVIES_TAB
        };
    }
    render() {
        return (
            <TabBarIOS
                tintColor="red"
                barTintColor="white"
            >
                <TabBarIOS.Item
                    icon={require('./icons/Movies.png')}
                    title="Movies"
                    selected={this.state.selectedTab === tabIds.MOVIES_TAB}
                    onPress={() => this.setState({selectedTab: tabIds.MOVIES_TAB})}
                >
                    <MovieList />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={require('./icons/Shows.png')}
                    title="Shows"
                    selected={this.state.selectedTab === tabIds.SHOWS_TAB}
                    onPress={() => this.setState({selectedTab: tabIds.SHOWS_TAB})}
                >
                    <Text>Shows tab</Text>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={require('./icons/Edit.png')}
                    title="Edit"
                    selected={this.state.selectedTab === tabIds.EDIT_TAB}
                    onPress={() => this.setState({selectedTab: tabIds.EDIT_TAB})}
                >
                    <Text>Edit tab</Text>
                </TabBarIOS.Item>
            </TabBarIOS>
        )
    }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
