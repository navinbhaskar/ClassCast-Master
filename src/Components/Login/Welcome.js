import React, {Component} from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from "./LoginStyles";
import {goTo} from "../../Redux/Navigation/NavigationActions";

class Welcome extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to ClassCast</Text>
        <Text>You have been successfully registered!</Text>
        <TouchableNativeFeedback
          onPress={() => {
            this.props.goTo([1, 0]);
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>

    )
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators({
  goTo: goTo
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)