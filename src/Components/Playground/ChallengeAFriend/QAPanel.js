import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, Text, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Test/TestStyles';
import AnswerOptions from './AnswerOptions';
import MathJax from 'react-native-mathjax';

const screen = Dimensions.get('window');

class QAPanel extends Component<{}> {
  constructor() {
    super();
    this.state = {
      height: 0,
    };
  }

  componentDidUpdate(prevProps) {

    const {currentIndex} = this.props.challenge;
    console.log("luaaaaad: " + currentIndex);
    const {currentIndex: prevIndex} = prevProps.challenge;
    if (currentIndex !== prevIndex) {
      this.setState({height: 0});
    }
  }

  render() {
    const {currentIndex, qa} = this.props.challenge;
    console.log("luaaaaad: " + JSON.stringify(qa));

    return (
      <ScrollView style={{width: '100%'}}>
        <View style={styles.questionWrapper}>
          <Text style={styles.questionTitle}>Ques.</Text>
          <View style={{height: this.state.height}}>
            <MathJax
              html={qa[currentIndex].question}
              mathJaxOptions={{
                tex2jax: {
                  inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                  displayMath: [['$$', '$$'], ['\\[', '\\]']],
                  processEscapes: true,
                },
              }}
              onHeightUpdated={height => {
                if (!this.state.height) {
                  this.setState({height});
                }
              }}
              hasIframe={true}
              style={{width: 0.75 * screen.width}}
              enableAnimation={false}
              scalesPageToFit={Platform.OS === 'android'}
            />
          </View>
        </View>
        <AnswerOptions/>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  challenge: state.challenge,
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QAPanel);