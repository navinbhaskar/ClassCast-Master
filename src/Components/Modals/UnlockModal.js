import React, {Component} from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './ModalStyles';
import {showModal} from "../../Redux/App";

class UnlockModal extends Component {
  render() {
    return (
      <View style={styles.unlockModal}>
        <Text style={styles.unlockModalMessage}>
          You need to add at least 2 teachers to unlock this section!
        </Text>
        <TouchableNativeFeedback
          onPress={() => {
            this.props.showModal(null);
            this.props.history.push('/');
          }}
        >
          <View style={styles.unlockModalButton}>
            <Text style={styles.unlockModalButtonText}>Okay</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators({
  showModal: showModal,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UnlockModal);