import {combineReducers} from 'redux';
import user from './User/User';
import navigation from "./Navigation/Navigation";
import teachers from "./User/Teachers";
import test from "./Playground/Test";
import challenge from './Playground/Challenge';
import concept from './Playground/ConceptGym';
import app from './App';
import learn from './Learn';

const reducers = combineReducers({
  user,
  navigation,
  teachers,
  test,
  challenge,
  app,
  concept,
  learn,
});

export default reducers;
