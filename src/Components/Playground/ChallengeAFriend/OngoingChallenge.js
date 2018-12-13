import React, {Component} from 'react';
import {BackHandler, Dimensions, Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from '../Test/TestStyles';
import NavigationBar from '../../Basic/NavigationBar';
import QAPanel from './QAPanel';
import SnapCarousel from 'react-native-snap-carousel';
import {goToQuestion, loadCarousel, updateChallengeRequest} from "../../../Redux/Playground/Challenge";
import axios from 'axios';

const screen = Dimensions.get('window');

class OngoingChallenge extends Component<{}> {
  _renderItem = ({item, index}) => {
    return (
      <View style={styles.navigatorItem}>
        <Text style={styles.navigatorItemText}>
          {index + 1}
        </Text>
      </View>
    );
  }

   _showConfirmationPopup = () => {
    this.setState({showSubmitConfirm: true})
  }

  constructor() {
    super();
    this.state = {
      data: [],
      showSubmitConfirm: false,
      exitWarning: false,
    }
  }

  componentDidMount() {
    let data = [];
    let {qa} = this.props.challenge;
    for (let i = 0; i < qa.length; ++i) {
      data.push(i);
    }
    this.setState({data});

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.exitWarning) {
        if (this.props.test.reviewMode) {
          this.props.history.push('/test/performance')
        }
        else {
          this._showConfirmationPopup();
        }
      }
      else {
        this.setState({showSubmitConfirm: true})
        //ToastAndroid.show('Press back again to exit the test', ToastAndroid.SHORT);
        this.setState({exitWarning: true});
        setTimeout(() => {
          this.setState({exitWarning: false})
        }, 1000);
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          rightButtonStyle={this.props.challenge.reviewMode ? 'REVIEW_CLOSE' : 'TEST_EXIT'}
          rightButtonAction={
            this.props.challenge.reviewMode
              ? () => this.props.history.push('/test/performance')
              : () => {
      if (this.state.exitWarning) {
        if (this.props.test.reviewMode) {
          this.props.history.push('/test/performance')
        }
        else {
          this._showConfirmationPopup();
        }
      }
      else {
        this.setState({showSubmitConfirm: true})
        //ToastAndroid.show('Press back again to exit the test', ToastAndroid.SHORT);
        this.setState({exitWarning: true});
        setTimeout(() => {
          this.setState({exitWarning: false})
        }, 1000);
      }
    }
          }
        />
        <View style={styles.ongoingTest}>
          <View style={[styles.questionNavigator, {height: 0}]}>
            <TouchableNativeFeedback
              onPress={() => {
                this._carousel.snapToPrev()
              }}
            >
              <View style={styles.navigatorPrevious}>
                <Image
                  style={{height: '75%', width: '100%'}}
                  resizeMode={'contain'}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAB4UlEQVR4Xu2aV27DMBAFxwdO7703p5dDJrcIFogAQUhIA+ZynyPy36Le7CxlkZow8jEZeX4agGbAyAm0Fhi5AG0RbC3QWmDkBFoLiAtwD3wBD173qWyAhd/8Cb7lBUEVwBSw0P3hAkERwG/hOxDFIagBuAO2E/1ua8HQjLmWByUAt8BOzfA2lwqAXPjH3oI4V8WHP1YAcAPsJlK5hVcwIBf+CdgoWvLBxSINuAb2EuHcw0cacAXsJ8I/A+uele+uHWGATPgIAy6Bg0RlX4C1GpWPMEAufE0DLoBDpcrXNOAcOEqEfwVWa2rfn8t7EZQO790CZ8BxorJvwEpU5b1bYCHCexlwCpwkKvsOLEdX3tOAHIAPYOk/A7BsuRaQscDzKbAQEDwBmAm5x2C4Cd4AZoEQ+jisAcAg5P4Kh0GoBcAg5F6GQiDUBCAJoTYAg5DbEKn6chQBQApCFACDkNsUrWJCJACDkNsWd4cQDWAWCK77hAoADELuaMwNggqAMAhKAAxC7ni8uAlqAAxC6gMJOzMwCMWGIoC/INhRmR2ZFR2qACxk/yMpOyG2w9LiQxlAB+ETsG8EXIY6AJfQ/Ys2AO6IxSdoBogXyP32mgHuiMUnaAaIF8j99poB7ojFJxi9Ad/tAVBB5G1aEAAAAABJRU5ErkJggg=='}}
                />
              </View>
            </TouchableNativeFeedback>
            <View style={{marginLeft: 0.125 * screen.width}}>
              <SnapCarousel
                ref={(c) => this._carousel = c}
                data={this.state.data}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={0.75 * screen.width}
                itemWidth={0.15 * screen.width}
                enableMomentum={true}
                inactiveSlideScale={0.66}
                inactiveSlideOpacity={0.5}
                autoplayDelay={100}
                autoplayInterval={1000}
                onSnapToItem={index => {
                  this.props.goToQues(index);
                }}
              />
            </View>
            <TouchableNativeFeedback
              onPress={() => {
                this._carousel.snapToNext()
              }}
            >
              <View style={styles.navigatorNext}>
                <Image
                  style={{height: '75%', width: '100%'}}
                  resizeMode={'contain'}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAB8ElEQVR4Xu2a127EIBBFz+YHks9M70rvm6r09r2JRlqkVZRgy/YMQ4AXPwG+x/cCBkYUXkaF66cCqA4onECNQOEGqINgjUCNQOEEagSUDbAPzALy/FLuq1Pzmg7YA24mb3ULHHiEoAVgFxDR08UlBA0AO8DdH34URxx6coIGgAdgKxJIVxA0AEibj8BGDhA0AIhuafcJWI9AuAaOUsdBC0A2EDQBBAjPwFrECVfAcSonaANwD8ECQIDwAqx6c4IVgADhFViJQLgETizjYAnAJQRrAAHCG7AcccIYOLVwQgoAAcI7sJQaQioAAcIHsJgSQkoAbSFcAGdacUgNIED4BBYiThAIMiYMXjwAEFEzgECYjyg8nzhhUAheACSDUAEM6qfujRUdAREv02GRg6BEsM0M8C+nwTbi1ZfEqQZBF+LDIqT70NWtpohPvgQOr27tgDbiTfcELAFIX01/gKbiLSPQRnySzVELB0gfTRsgScRbOMC1eG0AIr5pEzT56ZBWBLIQr+UAEd90BuDmhFjDASI+dhTmRryWAzYnx+O/rRNdidcCIO1uA/c/CBRzRSbonr4q41K8pgMCBLkpNlfqNblu/4rGtTRmAWMJ/bqrAPrxy792dUD+37CfguqAfvzyr10dkP837KegOqAfv/xrfwNrmnBB2HOVKgAAAABJRU5ErkJggg=='}}
                />
              </View>
            </TouchableNativeFeedback>
          </View>
          <QAPanel/>
          <View style={styles.nextQuestionWrapper}>
            <TouchableNativeFeedback
              onPress={() => {
                console.log(this.props.challenge);
                const {to, qa, id, currentIndex, answers, received} = this.props.challenge;
                const questionId = qa[currentIndex].id;
                const isCorrect = !!qa[currentIndex].correct[answers[currentIndex]];
                if(this.props.challenge.received){
                        axios.post('http://api.classcast.in/classcast/caf/challenge/submission', {
                  challenge_id: id,
                  question_id: questionId,
                  correctly_attempted: isCorrect,
                  chl_to: to,
                }
                )
                  .then(res => {
                    console.log(res);
                    if (currentIndex === qa.length - 1) {
                      axios.get(`http://api.classcast.in/classcast/caf/challenge/${id}/stats`)
                        .then(res => {
                          console.log(res);
                          const me = res.data.defendant == this.props.user.username ? 'defendant' : 'opponent';
                          console.log(me, res.data.stats[me], res.data.stats[me].correctly_attempted);
                          console.log("eeeeeeeppppppppppppppee: "+ me);
                          this.props.updateChallengeRequest({correctAnswers: res.data.stats[me].correctly_attempted});
                          console.log("eeeeeeeee: "+res.data.stats[me].correctly_attempted);
                          this.props.history.push('/challenge/result');
                        })

                    }
                    else {
                      this._carousel.snapToNext()
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    console.log(e.response);
                  });
                        }
                  else{
                     axios.post('http://api.classcast.in/classcast/caf/challenge/submission', {
                  challenge_id: id,
                  question_id: questionId,
                  correctly_attempted: isCorrect,
                  chl_by: this.props.user.username,
                }
                )
                  .then(res => {
                    console.log(res);
                    if (currentIndex === qa.length - 1) {
                      axios.get(`http://api.classcast.in/classcast/caf/challenge/${id}/stats`)
                        .then(res => {
                          console.log(res);
                          const me = res.data.defendant == this.props.user.username ? 'defendant' : 'opponent';
                          console.log(me, res.data.stats[me], res.data.stats[me].correctly_attempted);
                          console.log("eeeeeeeppppppppppppppee: "+ me);
                          this.props.updateChallengeRequest({correctAnswers: res.data.stats[me].correctly_attempted});
                          console.log("eeeeeeeee: "+res.data.stats[me].correctly_attempted);
                          this.props.history.push('/challenge/result');
                        })

                    }
                    else {
                      this._carousel.snapToNext()
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    console.log(e.response);
                  });
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
        {
          this.state.showSubmitConfirm &&
          <View style={styles.submitConfirmOverlay}>
            <View style={styles.submitConfirmContainer}>
              <View style={styles.messageTextContainer}>
                <Text style={styles.messageText}>Do you really want to leave the battleground?</Text>
              </View>
              <View style={styles.submitConfirmButtonsContainer}>
                <TouchableNativeFeedback
                  onPress={() => axios.get(`http://api.classcast.in/classcast/caf/challenge/${this.props.challenge.id}/stats`)
                        .then(res => {
                          console.log("madarchodooo2");
                          const me = res.data.defendant == this.props.user.username ? 'defendant' : 'opponent';
                          console.log(me, res.data.stats[me], res.data.stats[me].correctly_attempted);
                          console.log("eeeeeeeppppppppppppppee: "+ me);
                          this.props.updateChallengeRequest({correctAnswers: res.data.stats[me].correctly_attempted});
                          console.log("eeeeeeeee: "+res.data.stats[me].correctly_attempted);
                          this.props.history.push('/challenge/result');
                        })
              }
                >
                  <View style={styles.submitConfirmButton}>
                    <Text style={styles.submitConfirmButtonText}>Yes</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={() => this.setState({showSubmitConfirm: false})}
                >
                  <View style={[styles.submitConfirmButton, {backgroundColor: '#a268cc'}]}>
                    <Text style={[styles.submitConfirmButtonText, {color: 'white'}]}>No</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>
          }
          {
           (this.state.exitWarning) &&
          <View style={styles.submitConfirmOverlay}>
            <View style={styles.submitConfirmContainer}>
              <View style={styles.messageTextContainer}>
                <Text style={styles.messageText}>Do you really want to leave the battleground?</Text>
              </View>
              <View style={styles.submitConfirmButtonsContainer}>
                <TouchableNativeFeedback
                  onPress={() => axios.get(`http://api.classcast.in/classcast/caf/challenge/${this.props.challenge.id}/stats`)
                        .then(res => {

                          console.log("madarchodooo");
                          const me = res.data.defendant == this.props.user.username ? 'defendant' : 'opponent';
                          console.log(me, res.data.stats[me], res.data.stats[me].correctly_attempted);
                          console.log("eeeeeeeppppppppppppppee: "+ me);
                          this.props.updateChallengeRequest({correctAnswers: res.data.stats[me].correctly_attempted});
                          console.log("eeeeeeeee: "+res.data.stats[me].correctly_attempted);
                          this.props.history.push('/challenge/result');
                        })
              }
                >
                  <View style={styles.submitConfirmButton}>
                    <Text style={styles.submitConfirmButtonText}>Yes</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={() => this.setState({showSubmitConfirm: false})}
                >
                  <View style={[styles.submitConfirmButton, {backgroundColor: '#a268cc'}]}>
                    <Text style={[styles.submitConfirmButtonText, {color: 'white'}]}>No</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View> 
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  challenge: state.challenge
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goToQues: goToQuestion,
  loadCarousel: loadCarousel,
  updateChallengeRequest: updateChallengeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OngoingChallenge);