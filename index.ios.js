'use strict';

import React, {
    AppRegistry,
    Component
} from 'react-native';

import { Provider } from 'react-redux';
import { create } from './store';
import TabsView from './components/tabsView';

const store = create();

class RaspTvNative extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <TabsView />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
