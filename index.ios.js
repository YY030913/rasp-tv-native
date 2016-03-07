'use strict';

import React, { AppRegistry, Component } from 'react-native';
import MovieList from './components/movieList';

class RaspTvNative extends Component {
  render() {
      return <MovieList />;
  }
}

AppRegistry.registerComponent('RaspTvNative', () => RaspTvNative);
