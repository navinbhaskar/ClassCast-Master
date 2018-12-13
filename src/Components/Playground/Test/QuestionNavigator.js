import React, {Component} from 'react';
import {Dimensions, Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from "./TestStyles";
import SnapCarousel from 'react-native-snap-carousel';
import {goToQuestion, loadCarousel} from "../../../Redux/Playground/Test";

const screen = Dimensions.get('window');

class QuestionNavigator extends Component<{}> {
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
      data: []
    }
  }

  componentDidMount() {
    let data = [];
    let {qa} = this.props.test;
    for (let i = 0; i < qa.length; ++i) {
      data.push(i);
    }
    this.setState({data});
  }

  render() {
    return (
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
            ref={(c) => {
              this._carousel = c;
              if (!this.props.test.navigatorCarousel) {
                // this.props.loadCarousel(c);
                this.props.setNavigatorCarousel(c);
              }
            }}
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
    )
  }
}

const mapStateToProps = state => ({
  test: state.test,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goToQues: goToQuestion,
  loadCarousel: loadCarousel,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QuestionNavigator);
