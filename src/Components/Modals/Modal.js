import React, {Component} from 'react';
import {View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './ModalStyles';
import TNC from './TNC';
import UnlockModal from './UnlockModal';
import ChallengeModal from './Challenge';
//import Teachers from '../Login/Teachers';
//import Teachers from './AddTeachers';

class Modal extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.props.app.modal === 'tnc' ? <TNC/> : null
        }
        {
          this.props.app.modal === 'unlock' ? <UnlockModal history={this.props.history}/> : null
        }
        {
          this.props.app.modal === 'challenge' ? <ChallengeModal history={this.props.history}/> : null
        }
       
      </View>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Modal);