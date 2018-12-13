import React, {Component} from 'react';
import {Dimensions, Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Playground/Test/TestStyles';
import NavigationBar from '../Basic/NavigationBar';
import QAPanel from './QAPanel';
import {goToQuestion} from "../../Redux/Playground/Test";
import firebaseApp from '../Firebase.js';

firebaseApp.analytics().setCurrentScreen("Assignment");


const screen = Dimensions.get('window');
const parseString = require('react-native-xml2js').parseString;

class Assignment extends Component<{}> {
  _showConfirmationPopup = () => {
    this.setState({showSubmitConfirm: true})
  };
  _renderItem = ({item, index}) => {
    return (
      <View style={styles.navigatorItem}>
        <Text style={styles.navigatorItemText}>
          {index + 1}
        </Text>
      </View>
    );
  }

  constructor() {
    super();
    this.state = {
      data: [],
      currentQuestion: 0,
      showSubmitConfirm: false,
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data.map(xml => {
        let question;
        parseString(
          xml,
          (err, result) => {
            question = {
              question: result.problem.multiplechoiceresponse[0].p[0],
              answers: result.problem.multiplechoiceresponse[0].choicegroup[0].choice.map(choice => choice._),
              correct: result.problem.multiplechoiceresponse[0].choicegroup[0].choice.map(choice => choice.$.correct).findIndex(elem => elem === "true"),
            };
          });
        return question;
      })
    });
  }

  render() {
    return (
      <View style={[styles.container, {paddingTop: 0, elevation: 100}]}>
        <NavigationBar
          test={true}
          challenge={true}
          rightButtonAction={() => this.props.close()}
          rightButtonStyle={'REVIEW_CLOSE'}
        />
        <View style={styles.ongoingTest}>
          <QAPanel data={this.state.data} currentIndex={this.state.currentQuestion}/>
          <View style={styles.nextQuestionWrapper}>
            <TouchableNativeFeedback
              onPress={() => {
                if (this.state.currentQuestion === this.state.data.length - 1) {
                  this.props.learnNext();
                }
                else {
                  this.setState({
                    currentQuestion: (this.state.currentQuestion + 1),
                  })
                }
              }}
            >
              <View style={styles.nextQuestion}>
                <Image
                  style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  resizeMode={'contain'}
                  source={{uri: 'data:image/png;base64,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'}}
                />
                <Text style={styles.nextQuestionText}>
                  NEXT
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  test: state.test
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goToQues: goToQuestion,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Assignment);