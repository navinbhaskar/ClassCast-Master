import React, {Component} from 'react';
import {Dimensions, Image, Platform, ScrollView, Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Test/TestStyles';
import {markOption, setAnswers} from "../../../Redux/Playground/Test";
import MathJax from 'react-native-mathjax';
import {View as AnimatedView} from 'react-native-animatable';
import Sound from 'react-native-sound';


const sound = new Sound('http://www.slspencer.com/Sounds/Chewbacca/Chewie3.mp3', null, (error) => {
  if (error) {
    console.log("notworkinggggg" + error);
  }else{
    console.log("workingggggggggg");
  }
} );
const correctSound = new Sound('correct.wav', Sound.MAIN_BUNDLE);
const wrongSound = new Sound('wrong.wav', Sound.MAIN_BUNDLE);


const screen = Dimensions.get('window');

class AnswerOptions extends Component<{}> {
  selectOption = option => {
    if (this.props.test.reviewMode) {
      return;
    }
    this.props.markOption({
      questionIndex: this.props.test.currentIndex,
      optionIndex: option
    })
    // let answers = this.props.test.answers;
    // answers[this.props.test.currentIndex] = answers[this.props.test.currentIndex] === option ? -1 : option;
    // this.setState({answers});
  };
  checkAnswer = () => {
    const {currentIndex, answers, correctAnswers} = this.props.test;
    return (
      answers[currentIndex] === -1
        ? {
          icon: 'data:image/png;base64,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',
          text: 'Unanswered'
        }
        : answers[currentIndex] === correctAnswers[currentIndex]
        ? {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAACl1BMVEUAAACP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YWP9YXXCMKnAAAA3XRSTlMAHktxlK7G4vDx5cqxl3RRJAVPltL+/9eeWRAnf+HuiDI/p/ny97VMHPjJnWY6JRYODRQjN2HDsChu9uSZUBcRSY/bgA+9Usggy0O89Vpg/U17sqGNcIRrkF9Cdz4rXgdAH8VWaY4MvqgVATFB2rvTRTZ+48HqW+8CgtSYzux5t9nNmgYZ+sAE5jjMuatqn32SZdBXNAodLSHo0d+/nN7rpLMY6Ru63RK4z6DHU8SFpeBECXj0SBMijNg1GmMLh4Foptw7+yrnLJOtqkpkJrY8LqyLVTDtqU5stC85b5syfyQAAARMSURBVHicnZf5QxVVFMePIsoim8DFUFTiiQ+QRQMCRFJDMjMTFIpNFNEwDTFUcIdI24wsMUML0qzcUNIUy6Xct7LV0uqP8Zw785jl3RnuvPPDXc73nM87787MvTMAljZkqN8w/+EjAgKDgkeGhIaFW0daWMSoyKhoZrSY0U/EOkCMGRvHhDZu/ARJRPyT+rwEl2uifp44SQLhHu0JT0pOmZyalp4xZepTmVmR2S6P/+mcwRi5eUrktPzpBUblmRkzZ6mYZ20RhbOVqKisCKFe9Jyqz7FmzAjiIc+HWYfMfYGHzHvRKmA+11/Ksi0WFgTwsGKx6sfFkjR7BkDBQh64SKSVcqlsMATZyzz0FW+hnAuWf9VoFUkUXGl2V3HGXDkGQPU8Cl9sdNbw1Voiy0BKAiUsNfhqybVMngGQSRlBek+d9Jpqxm+I5dp8Bc1fdcYASKEsbZepp+lKp5DXaHGzPbNVgpWWsdWUN12dlOD4decMgAZMXKMM3QRs9AUyhjLX8uEbOGryhQGwDlPraVCzHkcbpPPq9IvHV9ONg0nYN8siWrIZ26ibb8LkXOw3Y58vyajZgsFbdY5tON+OfSv2Mjs4WRuV/6bOUU27XDu8hd2OQrk6gomx82297x30vMuX5D0Hdbxv9O1C1wcQim2HgzpM3g/Rtxsisf1IBvIx34HN3j10KII/tp0G/95PRHUMF9UBsI+vRjK2n+rdnV3RId6Q/YL1IIvALfEANOHFMewCn2H055J1oHUz1gOBjLky9F7+TvCFIbCF13FQxIAYzAeXGXLoS8pYqPO011rWoULw+E2YanAfnmWsRanjKzEDvqbnoM1r54dveC2e58m2DmjZylgcjMSIVSbF3a3V0s7rOGLBgBwUj0I+tuVmqbCLMo/RLx2nUYMVA07wX9gm3AkGajlK/WxLBlSiHAJh2PZ6i0otJ+vt6wA4hXopLMU2b6+36m5iqtnUwe81Fg/Qh923Ajl2hMJItGOEY0DCaYBjxiNVs8NNdtdWsVw1Yo/5dNdq6bO5torR43sG+4zvcHBWGHJuvMXrncf6qVb+knceB9/bB1tZycCapRHuB18YFyizQhnjgcSSfYHQrhGnjlf7eKLTocMuemb0qj3xkmMInTlRA7MCQu5yyrhMWRO0+Y80/8kZo5Fyrug9V8lzzQljDvNag0PX6Ui+Ic9Ivym4MYrIl3dLlrGSfxmFmt3FvLwqOUbONIq+7S0sZ4bLbmdD6c+zOyJJoUROGQzRUsYD74rVSi523bNnZLbysN1W+s87uO5v8zTmdCj7ndcHk2a/qF++938V67/9rujNqXa1tv+h7s7BxZ1mbZ/fTlVMSbdjoK1N9OzyB+6M/fMvfkuevlF05kqrx18r85G3oZdp1twXE9P9QOfYXyeBIKtIYRb29z+SCLL+h48emAGBDZX/OkBwu/Rf3cyS4KvrA1093W2Jt/+Pt35jfgwoj/pN6/cv+AAAAABJRU5ErkJggg==',
          text: 'Correct'
        }
        : {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAChVBMVEUAAAD1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIT1hIQnSF2HAAAA13RSTlMAHUpxlK7G4vDx5cqxl3RQIwNN0v7/1p1XDiR73+yFLzyk9c6pjXdlXmOKpu9JGJrenBMNQZarJWnzQjiL53wLuPqGEQnuHETgkB6AVVnTNifAdW2eAohqYkiJVj70cDUh61E0Gr5hP4cH+9zHEroqmXNHqA/LFlr5AeN4FUOMbmQ518mvOjvZ/W/pMOFsz489mL96flxgzRtf7ZNARebDUtsZknbaaOg32HkFIE4sxBAITwqB8h9yRrn8BIKyF7UrZp8m+Eyna7329wbqItUysDHBWK1LLQBk9LAAAARsSURBVHicnVj7QxRVFD481F1AdNMDamAqpoIVSEoUIoopviiDgBIlSJMA46HZwwcYKkqKlGkoYRqWEaFZSplKZqap+Shff4/nzOyys3PvnZ3Z75eZOd93Ps7sfZw7ACgRFh4ROWToMJc7KjpmeOyIkWqlAp4nIkeNxkDExY8Z68Bi3JMJKEXi+KdsWkyY6E2ZlDT56SlTp01Ljk2ZHv2MNxjzrA2L51J1cdqM8HRj/PmZs+J0JuOFYB6ZL7LONfwlGZk1O5vZ0XMsLXLmsmhe7nyV4OXYBaxIWqj2yFvEisVLrP7O/KWscS9T8flMv/KqZa2E5a+xrkBOFjL3elEwD0IxK4tlTAkzb9iwILzJ2hViXHuXUnseACtXkbrMHM1ij7fsegCUs8uYwJingmJv2/cAWM0TZk1A6B0KrXXiAVBJKQnGwFoKTHTmAcAT5l3/Y1U1Yo1TD4B15OKfmPH0tNy5yXu049T6HurIo965B0ADJa733m+g+/dDMQEa54363QeBP5ATfEip+l4Xi/jRx6GZwCbEeL56hiGmhugBmxGrt9B1K5WUJbCljXXmUFPjFkG2hpK30XUxYrZAfkJzOi8wFInYLJayHXEHXUZ5XysAO3k9thgj9RTYJZrQtHUVQfpu/1gb0MouhlqoDvw0TNTxOtwDeTQ2VSIJZewyuFVyHW7p7ryXd7I2xH0yEqZQXnWeoY5yqSwGMQXaETdIWcjkWj7ju8+5FSm6RAriEJ7zKXJaq4V/l1lch+pQQG+yDvYjNih4vZaWLyzqAFjGg9aMOFUlgAPeLq6sA2A9YhRQdz2oVMCXLvboOKRW0C6ZGMQEhrLJYQsBmXTCLsRkteQr7bi0oEutOIL4NRxFjFAqeGwnoXSF+nAM8RvIUHRVhjbHuo+xy1aVhkZwOxxXNwue653lAN+yy06FKJdOYBDBTuo6tDVXYlELvUk7hCOu8ljVwdBqWS01+Q7xBHQTPUFRx/eDa79MVQu3mx6AHxAjRVJbc4Y5pu0vPaKul17kR63sBIGbyXX0GSPs0ima0NKbS5eTxJ4yc3sowzTXmxB/EjxOU3IrXX/uRGwU2JbCbnPol7YzgizT19PPIvaLddoDjU2GdvMruf0Wmsc5/yz8HfH8hZBMsv1thDoVXgzF4yAl5vseBujhD+ceVf6TBegDtdFCrcAlSvvT/9grPyBb4zIl/WUMxAU2TTu4Qin9Ab0z/W+LLUOKPvfgKWkQV/ljSdKwVciJooRCc7SAN+QWmV6GcWkoWyz6R4z0009EXT9pr8mYFexy1o7HP7vVx3ht+7oe9Ic5nYHyd9Fx+AaxNxv+tfRIvoXWK/Z2Mws2WXzEjbjDigrLr01PrnYKaO69ImPDCpM0uj5dxhpw9z/9NHH0gGnu/b+59rzG3KsMYsG4f897KqmJmd2af66r60hpW/GDO95gx2UbFozKVPP/TnyY/tCmBaOvZCDRbOCqLXjkwELDmawT7QPRNbfc/RVpHZeON61UfxI9Bv5A8RG1L31hAAAAAElFTkSuQmCC',
          text: 'Incorrect'
        }
    )
  }

  constructor() {
    super();
    this.state = {
      answers: [],
      correctAnswers: [],
    }
  }

  componentDidMount() {
    if (!this.props.test.answers.length) {
      this.props.setAnswers({
        answers: this.props.test.qa.map(() => -1),
        correctAnswers: this.props.test.correctAnswers,
      });
    }
  }

  render() {
    const {currentIndex, qa, reviewMode, answers, correctAnswers} = this.props.test;
    return (
      <ScrollView style={styles.optionsContainer}>
        {
          reviewMode && <View style={styles.reviewTag}>
            <Image
              style={styles.reviewTagIcon}
              resizeMode={'stretch'}
              source={{uri: this.checkAnswer().icon}}
            />
            <Text style={styles.reviewTagText}>{this.checkAnswer().text}</Text>
          </View>
        }

        {
          qa[currentIndex].answers.map((option, index) => (
            <Option
              key={'testOption' + currentIndex + '' + index}
              index={index}
              text={option}
              select={this.selectOption}
              selected={index === answers[currentIndex]}
              marked={answers[currentIndex]}
              correct={answers[currentIndex] === correctAnswers[currentIndex]}
              review={this.props.test.reviewMode}
              showAsCorrect={correctAnswers[currentIndex] === index}
            />
          ))
        }
      </ScrollView>
    )
  }
}

class Option extends Component<{}> {
  constructor() {
    super();
    this.state = {
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
    if (this.props.showAsCorrect && this.props.marked !== -1) {
      highlight = {
        backgroundColor: '#80e180'
      }
    }
    if(this.props.selected){
      if (!this.props.correct) {
      wrongSound.play();
      console.log("2222222222222222" + this.props.correct + "2222222222222222" + this.props.marked);
    }
    if (this.props.correct && this.props.marked !== -1) {
      correctSound.play();
    }

    }
     
    return (
      <AnimatedView animation={'fadeIn'} duration={300} delay={1500} style={styles.option}>
        <View style={styles.optionLabelExtension}>
          <View style={styles.labelWrapper}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{optionLetter[index]}</Text>
          </View>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            if (this.props.marked !== -1) {
              return;
            }
            this.props.select(index)
          }}
        >
          <View style={[styles.textContainer, highlight]}>
            <View style={{height: 1.5 * this.state.height}}>
              <MathJax
                html={text}
                mathJaxOptions={{
                  tex2jax: {
                    inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                    displayMath: [['\\', '\\'], ['\\[', '\\]']],
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
      </AnimatedView>
    )
  }
}

const mapStateToProps = state => ({
  test: state.test,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  markOption: markOption,
  setAnswers: setAnswers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnswerOptions);

// '#a888f2'