'use strict';

import React, {
    AppRegistry,
    Component,
    Text,
    TabBarIOS
} from 'react-native';

import { Provider } from 'react-redux';
import { create } from './store';
import { TabIds } from './constants';
import MovieList from './components/movieList';

class RaspTvNative extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: TabIds.MOVIES_TAB
        };
    }
    render() {
        return (
            <Provider store={create()}>
                <TabBarIOS
                    tintColor="red"
                    barTintColor="white"
                >
                    <TabBarIOS.Item
                        icon={require('./icons/Movies.png')}
                        title="Movies"
                        selected={this.state.selectedTab === TabIds.MOVIES_TAB}
                        onPress={() => this.setState({selectedTab: TabIds.MOVIES_TAB})}
                    >
                        <MovieList />
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        icon={require('./icons/Shows.png')}
                        title="Shows"
                        selected={this.state.selectedTab === TabIds.SHOWS_TAB}
                        onPress={() => this.setState({selectedTab: TabIds.SHOWS_TAB})}
                    >
                        <Text>Shows tab</Text>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        icon={require('./icons/Edit.png')}
                        title="Edit"
                        selected={this.state.selectedTab === TabIds.EDIT_TAB}
                        onPress={() => this.setState({selectedTab: TabIds.EDIT_TAB})}
                    >
                        <Text>Edit tab</Text>
                    </TabBarIOS.Item>
                </TabBarIOS>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
