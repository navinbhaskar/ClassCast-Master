import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import styles from './TestStyles';
import CreateTest from './CreateTest';
import OngoingTest from './OngoingTest';
import TestPerformance from './TestPerformance';
import Topics from './Topics';
import Loading from './Loading';
import {goTo} from "../../../Redux/Navigation/NavigationActions";
import {Route} from 'react-router-native'

const screen = Dimensions.get('window');

class Test extends Component<{}> {
  render() {
    return (
      <View style={styles.flexContainer}>
        <Route exact path={`${this.props.match.url}`} component={CreateTest}/>
        <Route exact path={`${this.props.match.url}/topics`} component={Topics}/>
        <Route exact path={`${this.props.match.url}/loading`} component={Loading}/>
        <Route exact path={`${this.props.match.url}/ongoingTest`} component={OngoingTest}/>
        <Route exact path={`${this.props.match.url}/performance`} component={TestPerformance}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  test: state.test,
  section: state.navigation.currentSection
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goTo: goTo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Test);