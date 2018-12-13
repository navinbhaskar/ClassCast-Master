import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, Text, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Playground/Test/TestStyles';
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
    const {currentIndex} = this.props;
    const {currentIndex: prevIndex} = prevProps;
    console.log(currentIndex, prevIndex);
    if (currentIndex !== prevIndex) {
      this.setState({height: 0});
    }
  }

  render() {
    console.log(this.props);
    const {data, currentIndex} = this.props;
    console.log(data.length ? data[currentIndex].question : null);
    return (
      <View style={{height: screen.height * 0.8}}>
        <ScrollView style={{width: '100%'}}>
          <View style={styles.questionWrapper}>
            <Text style={styles.questionTitle}>Ques.</Text>
            <View style={{height: this.state.height}}>
              <MathJax
                html={data.length ? data[currentIndex].question : null}
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
          <AnswerOptions data={this.props.data} currentIndex={this.props.currentIndex}/>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QAPanel);