import React, {Component} from 'react';
import {Dimensions, Platform, Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Playground/Test/TestStyles';
import MathJax from 'react-native-mathjax';

const screen = Dimensions.get('window');

class AnswerOptions extends Component<{}> {
  selectOption = option => {
    let {answers} = this.state;
    answers[this.props.currentIndex] = answers[this.props.currentIndex] || option;
    this.setState({answers})
  };

  constructor() {
    super();
    this.state = {
      answers: [],
    }
  }

  render() {
    const {currentIndex, data} = this.props;
    const {answers = [], correct} = data[currentIndex] || {};
    return (
      <View style={styles.optionsContainer}>
        {
          answers && answers.map((option, index) => (
            <Option
              key={'testOption' + currentIndex + '' + index}
              index={index}
              text={option}
              select={this.selectOption}
              selected={index === this.state.answers[currentIndex]}
              correct={false}
              review={false}
              showAsCorrect={this.state.answers[currentIndex] !== undefined && correct === index}
            />
          ))
        }
      </View>
    )
  }
}

class Option extends Component<{}> {
  constructor() {
    super();
    this.state = {
      height: 0,
      optionLetter: [
        'A',
        'B',
        'C',
        'D',
      ],
    }
  }

  componentDidUpdate(prevProps) {
    const {text} = this.props;
    const {text: prevText} = prevProps;
    if (text !== prevText) {
      this.setState({height: 0});
    }
  }

  render() {
    const {text, index} = this.props;
    const {optionLetter} = this.state;
    let highlight = {};
    if (this.props.selected) {
      highlight = {
        backgroundColor: !this.props.correct && this.props.review ? '#f28889' : '#a888f2'
      }
    }
    if (this.props.showAsCorrect) {
      highlight = {
        backgroundColor: '#80e180'
      }
    }
    return (
      <View style={styles.option}>
        <View style={styles.optionLabelExtension}>
          <View style={styles.labelWrapper}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{optionLetter[index]}</Text>
          </View>
        </View>
        <TouchableNativeFeedback
          onPress={() => this.props.select(index)}
        >
          <View style={[styles.textContainer, highlight]}>
            <View style={{height: 1.5 * this.state.height}}>
              {/*<Text>{text}</Text>*/}
              <MathJax
                html={text}
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
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  // test: state.test,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  // markOption: markOption,
  // setAnswers: setAnswers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnswerOptions);

// '#a888f2'