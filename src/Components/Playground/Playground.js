import React, {Component} from 'react';
import {Animated, Dimensions, Image, PanResponder, View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import styles from './PlaygroundStyles';
import PgHome from './PgHome';
import Test from './Test/Test';
import ConceptGym from './ConceptGym/ConceptGym';
import ChallengeAFriend from './ChallengeAFriend/ChallengeAFriend';
import {Route} from 'react-router-native'

const screen = Dimensions.get('window');

class Playground extends Component<{}> {
  constructor() {
    super();
    this.state = {
      buttons: [
        'Concept Gym',
        'Test',
        'Challenge',
      ],
      pan: new Animated.Value(0.88 * screen.height),
    };
    this.initialValue = 0.88 * screen.height;
    this.panResponder = PanResponder.create({
      onStartShouldSetResponderCapture: (evt) => true,
      onMoveShouldSetResponderCapture: (evt) => true,
      onPanResponderGrant: (e, gs) => {
        this.state.pan.flattenOffset();
        this.state.pan.setOffset(this.state.pan._value);
        this.state.pan.setValue(0);
      },
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dy: this.state.pan
      }]),
      onPanResponderRelease: () => {
        if (this.state.pan._value < this.initialValue) {
          Animated.timing(
            this.state.pan,
            {
              toValue: -1 * screen.height,
              duration: 500,
            }
          ).start(() => {
            this.initialValue = -0.21 * screen.height;
          });
        }
        else if (this.state.pan._value > this.initialValue) {
          Animated.timing(
            this.state.pan,
            {
              toValue: screen.height,
              duration: 500,
            }
          ).start(() => {
            this.initialValue = 0.88 * screen.height;
          });
        }
      }
    });
  }

  componentDidMount() {

    this.state.pan.addListener(({value}) => this.setState({panValue: value}));
  }

  render() {
    console.log("BBBBBBBBBBBBBBBBBBBBDDDD: "+this.state.pan._value);
    const {pan} = this.state;
    return (
      <Animated.View
        style={[
          {
            transform: [{
              translateY: Animated.diffClamp(pan, -0.12 * screen.height, screen.height)
            }]
          },
          styles.animatedContainer
        ]}
        {...this.panResponder.panHandlers}
      >
        <Route path={this.props.match.url} render={() => {
          return (
            <View style={[styles.animatedContainer, styles.fix]}>
              <View style={styles.playPull}>
                <View style={styles.bottomLine}/>
                <Image
                  style={styles.playPullImage}
                  resizeMode={'contain'}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAh8AAAB+CAMAAACztIM1AAACiFBMVEUAAACZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/G/cfb////79//Cd/eZG/GZG/GpP/P9+//+/f+rRPSZG/GZG/GpQPP37v748P6tR/SZG/GnO/P16P6qQfOZG/H26v7t2P3q0Pz37f6tSPSZG/GvS/T58v7u2f2fKfKeJ/Ls1fz79v6xUvSZG/H58f6hLPLr0fz68/6sRfSZG/GjMvLozPyfKPLmyPynOvOZG/H05/6cIvGbIPHlxvv16v6pPvOZG/GZG/GgKvKeJvKsRvSoPfPw3v2iL/KZG/H26/6gK/Loy/yrQ/OmOfPx4f2dI/HnyPz05v2ZG/GZG/Hpzfzpz/zt1/2ZG/GZG/G/cPbv3P3ft/vIhPeZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GwUvLHiPO2X/KqRPK8bfPBe/OfKfGlNvGZG/H19fXYsfTev/Tw6PXNlvOZG/HTpPTkzfSZG/GZG/GZG/Hq2vWZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GZG/GljbabAAAA2HRSTlMACzNYfZ62y+Lw+P8sa6LV/Q9apOgKX7P5MpjyAUzBU0QdrgN19SPGYvQHnBvJKTvuQvY3MfH/////HOX/////DdD/////qP///2j//////y///////////wj//////5D//////0P///////8R5P///////1v///////////8Cvv///3Mu/////9GLQP4Qo1e8bioGz4g8Dt+gGey3KAX//////////4P//////zr//wzdm/9OF+u0ZyUEfzb82ksVsGMixXv7CdiTSBPmrF4gwnh3MB7Sbz1ELXM5AAAKBUlEQVR4nO2d+WMU5RnHAyo5RkwQ1AiRKygmBo2oTaulolBa8ChVUKlWFEVthbZWalvbghZ6cCOH4LkJycZks27U9T7B+z6r/judnZmEPd73eWdm35nvu5vn8wMkO5mZ533fz77zvO+8s1tTwzBQxo0/7vgTJtTW1TdYjBYa6utqJ5xw/HHjx6HbtlxOnHhSYxO6OquXpsaTJp6IbuOwTDp58hR0BY4Fpkw+eRK6rQNzyqmnNaMrbuzQfNqpp6BbPAinT52GrrKxxrSpp6Nb3SctZ0xHV9bYZPoZLei2V9MyoxFdT2OXxhmmGzKzFl1HY5vamWgDKGbNRtcPM3sW2gIZrXPORFcOY1lnzmlFmyDkrLnommFc5p6FdkHA2W3oamFGaDsbbUMx7eeg64TJ55x2tBEFdMxDVwhTyLwOtBN5nFuHrg6mmLpz0VaMcl4nujKYUjrPQ3vhcf58dFUwIuafjzbD4QIeuBhK2wVoN2wuvAhdDTr5QdcPf4SOQR8XXYi2o+biS9CVoJMfL+jq+sml6Cj0ccnFYD0WXoauAp1cvqjLZvFP0XHo47KFWD+WoCtAJz/7eZfDoqXoSPSxBKrHMnTxdbL0CtuNK6+y/7n6F+hY9LEMqMfyanpk4ZfX2GZcu2LldfZ/19+AjkYbDctheqyqpqVil/8qp8eNlrXiJvuHX9+MjkcbjatQfqxGF10jt+Ryj1vX5H5ceZv94xW3oyPSxmqQHmvRBdfI7XfYTlx1p/vLXb+xf/nt3dCAdLIWose69ehy62Pp1bmLy+9Gfv19LgdZ/AdkRDpZvw7hRxUNbe/JzXv88d5jL9x4ZS4HqZphLmKQuwFdaH3c/Sfbhpvuy39pzZ9zw9y/oCLSzYbY9ZhVjy6zNv56fy73WFP44t/+br/4j3swEWmnPu5F7Rs3oYusjwdsE65bUfzqygftl/+JiCcKNm2M14/N6AJrxE4+7i/RwxbEzkEWxB9NRGyOVY8t1fRw/r/u+Pe9otfv+8+C/8YdS2Q0b4lRj/at6OIyQdka44r2bejCMsHZFpse23egy8oEZ8f2mPTYyU8zVCR1O+PxYxe6oEw4dsWix250MZmw7I5Bjw5+GKpi6Yz+ocuWPehCMuHZE/nnTz2ELiJTDg9FrMfealpxOgZp2BupHvv2owvIlMf+fVH6cQBdPKZcDkSox8P8WfsVT9PDkelx8BC6cEz5HDoYlR+PoIvG6OCRiPSYgS4Yo4cZkejx6GPocjF6eOzRCPRoeRxdLEYXj0cwjToRXShGHxO16/EEfwhdFTH/Cc16PGnS93YkukX0HFbu0xvmbL3Unn0+Dpt0wusPc+7IqH1Srx9PoQuUT/eAhMG+JLlPKsTJkkPOoSXN2+dsJM200mFPHSVPadXjaaMmTqV+2GQkDRnaD+9k3ZLNw7mNw9QBDlN+wWh6WqMezzyLLk4BlB+ylgzth9t9DAxJeqaEs7WPOECK0gvHs8/o8+M5dGEKof0YGBY1ZVg/emntLCtD2TNygKx8O4zntOnxPLooRQjbur8nnfWackiQD4T1Y+SYA1nJH7j5SUa2v7u5J/iJo+d5TXq88CK6JEVI2zoxKO1BQvrhvPtTTpIhG6W4PUxCstXpXgYDnzcOXnxBjx8voQtSDNHWPW66UNogIf1wkofeXqoDcf9GstVJT4ZMS049XtKix8voYpRAtfXhIfHbOZwfCa/ps1QXcZjIT4bNTE49XtagxyvmfT0D2dZua5VsDefHoDc46SP3Tks7iT6y44HT9krZerxq4DeH0W3tjm6KU9RQfvSPjE3cLFM2DZbMSpKM/iGq3zGAea+W68dr6CIIoNvabcviPj2UH5nRI6XJQUrPgHiQMkjuZQKvlanH62+gSyBA0dYZ0eYwfiSdZneuG/3HfhSREk5yJEa6H3N54/Wy9Bj3JroAIhRt7Yw2hoLtIz+P9/bPkF1BvzBFzXrZi8m8Oa4cP6aiwxeiaGt3yjvYPiIKkg5FX9At6F+c18hbMyYwtQw93kIHL0bV1pr8KBy0KG6jZEuO3y/Mk83jrdB6HJmCjl1MTH5kC5JO4VXrGG6nlT/H6giVDnRGCFOOhPXjKDp0CfH4UTxpmi0WoJDBogtQj/nJqcfRkHq8jQ5cRjz5R/FNF8VclzvXMdpfJBU6mcTbofR4x7yJU49Yxi8lCanqTmzhUjIjF41JaHsnhB6t76LDlqJo60Et8x+l+ajqEPlLycxcNCbj3dbgfryHDloO3VDuuKF42iGoH4IJMfcl+Wx5/lIyQxeNyXgvsB7j30fHLIdu60HhWzeoH6L5MNVajmNLyYxdNCbh/fEB9fjgQ3TIBGRbu8t1yr1/K5xPV100RpeSGbxoTMKHHwTz4yN0wBRUW3vrRctd/yFOL1OCTqX05AmTF43J+CiQHh+jwyWRt3Uy7epROi0VzI+k+Ma8e5+WuGw4Ag0bvWhMxscB9PjkU3S0JLK27u/2HkYQ3PQI5ke3ZK4jq0g73SuQcIGB6Xz6iX8/PkMHS+Pe+EoU0pceHvAQPeAQzA/Z5FbvaAYqIT0Sg7mLxmR85luPz9GhKlA8/5Ip+/kX6b0W97pDzIomR56HMHjRmIzPferxxTR0pApIP4bEw4ZAfsgvI7ILzyg9nqM+z2QS077wpUfrl+hAVRB+ZGVPaAfxw53oSos+JMAZmZC3VVKqS5C5fOlrGvUrdJhKZH6k0vLVFkH8SFH9Uw5q0U/oB30N4Gsfenxj/lcPup184Rs7kaDHkwGaLaHSg8wuKtmP5m+UeqxqRAepJvRaUn/7ZNR+EAeqZD+sxlUqP1ajQ/RBtH64U+spKc5meWdV0X5YqxV6zEQH6Ido/cgoMgxncCMfn1S2H9ZaUo9169Hx+SFSP5RTHL10B1LhfqxfR/mxBB2eLyL1QznDoZhkr3A/rCWEHhvQwfkjUj+c7oN8qMk5lHSGo9L9sDZI9fhfPTo2f0Tph/IOi+wB33KCM4r6WRI9Nm5Ch+aTKP1wLh6Kp1Yy1CWo4v2wNm0U+7EZHZhfIvRDkXy6uCNgSQpb+X5Ym4V6bDF/4tQjtB9Z0S2V7vyPQFatEHOhOpAq8KN5i0CP9m/RYfkmtB/KCVF3al15b576syrww/q2vdSPbeig/BOdH8JHZwSk5H9XDX5Y20r02L4DHZN/IvPDTSx8rDt30xTh3eKq8GPH9iI9dtahQwpAZH6QA5MC5JPsVeGHVbez0I/J6IAYs5hcoMdudDiMaezO06OjEx0NYxqdHaN6tOxBB8OYx57RLzH8Dh0KYyLfeXrsbUBHwphIw15Hj3370YEwZrJ/X86PA+gwGFM5YOvxvVFfPciYRNP3NQcPoYNgzOVQDToCxmjYD4aC/WAo2A+Ggv1gKNgPhoL9YCjYD4aC/WAo2A+Ggv1gKNgPhoL9YCjYD4bi/z+2DB2RElvKAAAAAElFTkSuQmCC'}}
                />
                {/*<Text style={styles.playPullText}>Play</Text>*/}
              </View>
              <View style={styles.container}>
                {/*<PgHome match={this.props.match} />*/}
                <Route exact path={`${this.props.match.url}`} component={PgHome}/>
                <Route path={`${this.props.match.url}/concept`} component={ConceptGym}/>
                <Route path={`${this.props.match.url}/test`} component={Test}/>
                <Route path={`${this.props.match.url}/challenge`} component={ChallengeAFriend}/>
              </View>
            </View>
          )
        }}/>
      </Animated.View>
    )
  }
}

const mapStateToProps = state => ({
  section: state.navigation.currentSection
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Playground)