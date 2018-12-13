import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {showModal} from "../../Redux/App";
import { StyleSheet, Text, View } from 'react-native';

class Teachers extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  app: state.app,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  showModal: showModal,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Teachers);
