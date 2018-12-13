import React, {Component} from 'react';
import {View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './LoginStyles';
import SocialAuth from './SocialAuth';
import Fields from './Fields';
import Phone from './Phone';
import Welcome from './Welcome';
import ClassSelect from './ClassSelect';
import Teachers from './Teachers';

class Login extends Component<{}> {
  router = ({section}) => {
    const props = this.props;
    let components = [
      <SocialAuth {...props} />,
      <Fields/>,
      <Phone/>,
      <ClassSelect {...props} />,
      //<Location/>,
      <Teachers {...props} />,
      
      <Welcome/>,
    ];
    // return components[4];
    return components[section[1]];
  }

  render() {
    console.log("JJJJJJJJJJJJJJJJJJJJJJ");
    return (
      <View style={styles.container}>
        {this.router(this.props)}
      </View>
    )
  }
}


const mapStateToProps = state => ({
  section: state.navigation.currentSection
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login)