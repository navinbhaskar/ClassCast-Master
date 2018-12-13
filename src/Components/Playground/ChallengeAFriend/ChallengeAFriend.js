import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View} from 'react-native';
import styles from '../PlaygroundStyles';
import Challenge from './Challenge';
import Loading from './Loading';
import Result from './Result';
import Topics from './Topics';
import Contacts from './Contacts';
import Subjects from './Subjects';
import OngoingChallenge from './OngoingChallenge';
import {Route} from 'react-router-native';
import {showModal} from "../../../Redux/App";

class ChallengeAFriend extends Component {
  renderSection = ({section}) => {
    let sections = [
      <Challenge/>,
      <Contacts/>,
      <Subjects/>,
      <Topics/>,
      <Loading/>,
      <OngoingChallenge/>,
      <Result/>,
    ];

    return sections[section];
  }

  componentDidMount() {
    // this.props.showModal('unlock');
  }

  render() {
    const {challenge} = this.props;
    return (
      <View style={styles.flexContainer}>
        <Route exact path={`${this.props.match.url}`} component={Challenge}/>
        <Route path={`${this.props.match.url}/contacts`} component={Contacts}/>
        <Route path={`${this.props.match.url}/subjects`} component={Subjects}/>
        <Route path={`${this.props.match.url}/topics`} component={Topics}/>
        <Route path={`${this.props.match.url}/loading`} component={Loading}/>
        <Route path={`${this.props.match.url}/ongoingChallenge`} component={OngoingChallenge}/>
        <Route path={`${this.props.match.url}/result`} component={Result}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  challenge: state.challenge,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  showModal: showModal,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeAFriend);
