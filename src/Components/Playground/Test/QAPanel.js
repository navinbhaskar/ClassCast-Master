import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, Text, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './TestStyles';
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
    const {currentIndex} = this.props.test;
    const {currentIndex: prevIndex} = prevProps.test;
    if (currentIndex !== prevIndex) {
      this.setState({height: 0});
    }
  }

  render() {
    const {currentIndex, qa} = this.props.test;
    console.log(this.state.height);
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
                console.log(this.state.height, height);
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
  test: state.test,
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QAPanel);