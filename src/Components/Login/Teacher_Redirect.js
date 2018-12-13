import React, {Component} from 'react';
import {View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './LoginStyles';
import Teachers from './AddTeachers';

class Teacher_Redirect extends Component<{}> {
  router = ({section}) => {
    const props = this.props;
    let components = [
      <Teachers {...props} />,
    ];
    // return components[4];
    return components[section[1]];
  }

  render() {
    console.log("HHHHHHFFFFSSSLLL"+this.props);
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

export default connect(mapStateToProps, mapDispatchToProps)(Teacher_Redirect)