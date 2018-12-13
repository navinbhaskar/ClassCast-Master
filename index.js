import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {applyMiddleware, createStore} from 'redux';
import reducers from './src/Redux';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import Router from './router';

global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

const store = createStore(
  reducers,
  applyMiddleware(
    // logger
  )
);

const ReduxApp = () => (
  <Provider store={store}>
    <App/>
  </Provider>
);

AppRegistry.registerComponent('classcast', () => Router);
AppRegistry.registerComponent(appName, () => ReduxApp);
