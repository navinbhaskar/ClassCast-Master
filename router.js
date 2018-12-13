import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Home from './src/Components/Home/Home';
import CreateTest from './src/Components/Playground/Test/CreateTest';
import Menu from './src/Components/Menu/Menu';
const Router = StackNavigator({
  Menu: {screen: Menu},	
  Home: {screen: Home },
  CreateTest: {screen: CreateTest},
});
export default Router;