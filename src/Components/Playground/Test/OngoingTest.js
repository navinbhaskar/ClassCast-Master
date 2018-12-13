import React, {Component} from 'react';
import {BackHandler, Dimensions, Image, Text, ToastAndroid, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './TestStyles';
import NavigationBar from '../../Basic/NavigationBar';
import QAPanel from './QAPanel';
import SnapCarousel from 'react-native-snap-carousel';
import {goToQuestion, loadCarousel} from "../../../Redux/Playground/Test";
import firebaseApp from '../../Firebase.js';

firebaseApp.analytics().setCurrentScreen("OngoingTest");

const screen = Dimensions.get('window');

class OngoingTest extends Component<{}> {
  submitCurrentQuestion = cb => {
    const {id} = this.props.user;
    console.log(this.props.test, this.state.activeQuestion, this.props.user);
    const payload = {
      student_id: id,
      xblock_id: this.props.test.qa[this.state.activeQuestion].xblock_id,
      attempted: this.props.test.answers[this.state.activeQuestion] !== -1 ? 1 : 0,
      correctly_attempted: this.props.test.answers[this.state.activeQuestion] === this.props.test.qa[this.state.activeQuestion].correct ? 1 : 0,
      time_taken: 10.0,
      timestamp: this.getTimeInFormat(new Date()),
      appeared_in_test: 1,
      appeared_in_gym: 0,
    };

    let data = new FormData();
    data.append("student_id", id);
    data.append("xblock_id", this.props.test.qa[this.state.activeQuestion].xblock_id);
    data.append("attempted", this.props.test.answers[this.state.activeQuestion] !== -1 ? 1 : 0);
    data.append("correctly_attempted", this.props.test.answers[this.state.activeQuestion] === this.props.test.qa[this.state.activeQuestion].correct ? 1 : 0);
    data.append("time_taken", 10.0);
    data.append("timestamp", this.getTimeInFormat(new Date()));
    data.append("appeared_in_test", 1);
    data.append("appeared_in_gym", 0);

    console.log(payload, data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        cb();
      }
    });

    xhr.open("POST", "http://api.classcast.in/classcast/submission/newsubmission");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
    // axios.post(`http://api.classcast.in/classcast/submission/newsubmission`, payload).then(res => {
    //   console.log(res);
    // }).catch(e => {
    //   console.log('Submit error:', e);
    // });
  };
  getTimeInFormat = now => {
    const year = now.getYear() + 1900;
    const month = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
    const day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();

    const hours = now.getHours() > 9 ? now.getHours() : '0' + now.getHours();
    const mins = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
    const secs = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();

    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
  };
  nextQuestion = () => {
    this.submitCurrentQuestion(() => {
      this._carousel.snapToNext();
    });
  };
  _renderItem = ({item, index}) => {
    return (
      <View style={styles.navigatorItem}>
        <Text style={
          index !== this.state.activeQuestion
            ? [styles.navigatorItemText, {color: 'black'}]
            : styles.navigatorItemText
        }>
          {index + 1}
        </Text>
      </View>
    );
  };
  _showConfirmationPopup = () => {
    this.setState({showSubmitConfirm: true})
  }

  constructor() {
    super();
    this.state = {
      data: [],
      activeQuestion: 0,
      showSubmitConfirm: false,
      exitWarning: false,
    }
  }

  componentDidMount() {
    this.setState({
      startTime: (new Date())
    });

    setInterval(() => {
      this.setState({
        currentTime: (new Date())
      })
    }, 1000);
    let data = [];
    let {qa} = this.props.test;
    for (let i = 0; i < qa.length; ++i) {
      data.push(i);
    }
    console.log('Data', data, qa);
    this.setState({data});

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.exitWarning) {
        if (this.props.test.reviewMode) {
          this.props.history.push('/test/performance')
          firebaseApp.analytics().logEvent('Exited_Test', {time_spent: Math.round((currentTime - startTime)/1000)});
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
    const {startTime, currentTime} = this.state;
    const total = this.props.test.selectedTime === 12
      ? 30 * 60
      : 60 * 60;
    const timeLeft = total - Math.round((currentTime - startTime) / 1000);
    if (timeLeft <= 0) {
      this.submitCurrentQuestion(() => {
        this.props.history.push('/test/performance');
        firebaseApp.analytics().logEvent('Exited_Test', {time_spent: Math.round((currentTime - startTime)/1000)});
      })
    }
    console.log(`${parseInt(timeLeft / 60)}:${timeLeft % 60}`);
    return (
      <View style={styles.container}>
        <NavigationBar
          rightButtonStyle={this.props.test.reviewMode ? 'REVIEW_CLOSE' : 'TEST_EXIT'}
          rightButtonAction={
            this.props.test.reviewMode
              ? () => {
                this.props.history.push('/test/performance');
                 firebaseApp.analytics().logEvent('Exited_Test', {time_spent: Math.round((currentTime - startTime)/1000)});
                  }
              : () => {
                this.submitCurrentQuestion(() => {
                  this._showConfirmationPopup()
                });
              }
          }
          testMode={{
            timeLeft: `${parseInt(timeLeft / 60)}:${timeLeft % 60}`,
            questions: this.props.test.qa.length,
          }}
        />
        <View style={styles.ongoingTest}>
          <Image
            style={{
              position: 'absolute',
              height: 0.05 * screen.width,
              width: 0.05 * screen.width,
              left: 0.475 * screen.width,
            }}
            resizeMode={'contain'}
            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAWCAYAAABpNXSSAAABNklEQVR4nNWUrQrCUBiGNwbGCVZBhpdgMXgPBovJazAZdh0Wi8UbsBos3oJBMKwKYjIoFp3vCxM+x9ym29k5fvBs7Idznqcca9Q8ByD8YwILl6UBIkVYMsIBUwNkfoHejvUaPIzB3QCxPNBzbCUNPvTBxQDJNOjXTwwQIR1wMEA2CXp1UgNESAtsDZCW0KeVK0CEuGBlgHwYebhfBYgQnlwzzQHc38m2zY6ZgEfF8txvUlg+FjIA14oCuM+g1AAR0gVHxQFcv6skQIR4YKcogOt6SgNESB2sSw7gevVKAkRIDcxLCuA6tUoDYjF+wQBfm7wciAzB7Ut5/j/U7f42EOqBU84A/tfT7Zw4EGuDfUYAv7d1u6YOBBtg8yGA7xu6HXNNdHItYgELrSfQLwNhW4Twbqva6wllTat+JW2oIwAAAABJRU5ErkJggg=='}}
          />
          <View style={styles.questionNavigator}>
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
                itemWidth={0.115 * screen.width}
                enableMomentum={true}
                inactiveSlideScale={0.66}
                inactiveSlideOpacity={0.3}
                autoplayDelay={100}
                autoplayInterval={1000}
                onSnapToItem={index => {
                  this.submitCurrentQuestion(() => {
                    this.setState({activeQuestion: index});
                    this.props.goToQues(index);
                  });
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
              onPress={() => this.nextQuestion()}
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
                <Text style={styles.messageText}>Do you really want to submit the test?</Text>
              </View>
              <View style={styles.submitConfirmButtonsContainer}>
                <TouchableNativeFeedback
                  onPress={() =>{
                    this.props.history.push('/test/performance');
                    firebaseApp.analytics().logEvent('Exited_Test', {time_spent: Math.round((currentTime - startTime)/1000)});
                  }}
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
                <Text style={styles.messageText}>Do you really want to submit the test?</Text>
              </View>
              <View style={styles.submitConfirmButtonsContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    this.props.history.push('/test/performance');
                    firebaseApp.analytics().logEvent('Exited_Test', {time_spent: Math.round((currentTime - startTime)/1000)});
                  }}
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
  test: state.test,
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goToQues: goToQuestion,
  loadCarousel: loadCarousel,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OngoingTest);