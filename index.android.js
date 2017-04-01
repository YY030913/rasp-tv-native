'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { create } from './store';
import { NativeRouter, Route, AndroidBackButton } from 'react-router-native';
import TabsView from './components/tabsView';

const store = create();

class RaspTvNative extends Component {
    render() {
        return (
            <Provider store={store}>
                <NativeRouter>
                    <AndroidBackButton>
                        <Route path="/" component={TabsView} />
                    </AndroidBackButton>
                </NativeRouter>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
