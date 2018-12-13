import React, {Component} from 'react';
import {View} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import styles from '../PlaygroundStyles';
import Subjects from './Subjects';
import Topics from './Topics';
import OngoingGym from './OngoingGym';
import {Redirect, Route} from 'react-router-native';

class ConceptGym extends Component<{}> {
  render() {
    return (
      <View style={styles.flexContainer}>
        <Route exact path={`${this.props.match.url}`} component={Subjects}/>
        <Route exact path={`${this.props.match.url}/topics`} component={Topics}/>
        <Route exact path={`${this.props.match.url}/ongoingGym`} component={OngoingGym}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  concept: state.concept,
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConceptGym);