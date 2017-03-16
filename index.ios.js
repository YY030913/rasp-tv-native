'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { create } from './store';
import { NativeRouter, Route } from 'react-router-native';
import TabsView from './components/tabsView';

const store = create();

class RaspTvNative extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <NativeRouter>
                    <Route path="/" component={TabsView} />
                </NativeRouter>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
