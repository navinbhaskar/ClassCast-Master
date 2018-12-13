import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dimensions, Image, Text, TouchableNativeFeedback, View} from 'react-native';
import styles, {elements} from './NaivgationStyle';
import {openMenu} from "../../Redux/Navigation/NavigationActions";
import {nextTestSection} from "../../Redux/Playground/Test";
import {goToChallengeSection} from "../../Redux/Playground/Challenge";
import {toggleNotifications} from "../../Redux/App";
import axios from 'axios';

const screen = Dimensions.get('window');

class NavigationBar extends Component<{}> {
  _leftButton = (style = null, activity = this.props.openMenu) => {
    let icon;
    switch (style) {
      case 'MENU_GREY':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.greyMenuIcon}}
        />;
        break;
      case 'MENU_PURPLE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.purpleMenuIcon}}
        />;
        break;
      case 'MENU_WHITE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.menuIcon}}
        />;
        break;
      case 'BACK_WHITE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.whiteBackIcon}}
        />;
        break;
      case 'BACK_GREY':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.greyBackIcon}}
        />;
        break;
      default:
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.purpleMenuIcon}}
        />;
    }
    return (
      <TouchableNativeFeedback
        onPress={activity}
        useForeground={true}
      >
        <View
          style={styles.menuButton}
          hitSlop={{
            top: 0.1 * screen.height,
            bottom: 0.1 * screen.height,
            left: 0.1 * screen.width,
            right: 0.1 * screen.width
          }}
        >
          {icon}
        </View>
      </TouchableNativeFeedback>
    )
  };
  _rightButton = (style = null, activity = () => this.props.toggleNotifications(true)) => {
    let icon;
    switch (style) {
      case 'NOTIFICATION_GREY':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.greyNotificationIcon}}
        />;
        break;
      case 'NOTIFICATION_PURPLE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.purpleNotificationIcon}}
        />;
      case 'NOTIFICATION_WHITE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.whiteNotificationIcon}}
        />;
        case 'NONE':
        break;
      case 'TEST_EXIT':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.exitTestIcon}}
        />;
        break;
      case 'REVIEW_CLOSE':
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.closeReview}}
        />;
        break;
      default:
        icon = <Image
          style={styles.menuIcon}
          resizeMode={'contain'}
          source={{uri: elements.purpleNotificationIcon}}
        />;
    }
    return (
      <TouchableNativeFeedback
        onPress={activity}
        useForeground={true}
      >
        <View
          style={[styles.menuButton, styles.notificationButton]}
          hitSlop={{
            top: 0.1 * screen.height,
            bottom: 0.1 * screen.height,
            left: 0.1 * screen.width,
            right: 0.1 * screen.width
          }}
        >
          {icon}
        </View>
      </TouchableNativeFeedback>
    )
  }

  constructor() {
    super();
    this.state = {
      score: 0,
      rank: 0,
      streak: 0,
    }
  }

  componentDidMount() {
    const {id} = this.props.user;
    axios.get(`http://api.classcast.in/classcast/ranking/rankings/${id}/`)
      .then(res => this.setState(
        {
          score: res.data.Score,
          rank: res.data.Rank,
        }
      ));
    axios.get(`http://api.classcast.in/classcast/streak/streak/${id}/`)
      .then(res => this.setState(
        {
          streak: res.data,
        }
      ))
  }

  render() {
    let background = this.props.background ? {
      backgroundColor: '#f5f5f5',
      elevation: 3,
    } : {};
    return (
      <View style={[styles.navigationBar, background]}>
        {this._leftButton(this.props.leftButtonStyle, this.props.leftButtonAction)}
        {
          !this.props.noDashboard && <View style={styles.dashboard}>
            <Image
              style={styles.dashboardBack}
              resizeMode={'contain'}
              source={{uri: elements.dashboardBg}}
            />
            {
              !this.props.testMode
                ? <View style={styles.dashboardFront}>
                  <View style={styles.streak}>
                    <Text style={styles.dashboardTitle}>STREAK</Text>
                    <View style={styles.dashboardDataWrapper}>
                      <Text style={styles.dashboardData}>{this.state.streak}</Text>
                      <Text style={styles.dashboardSubData}>{this.state.streak > 1 ? 'DAYS' : 'DAY'}</Text>
                    </View>
                  </View>
                  <View style={styles.score}>
                    <Text style={styles.dashboardTitle}>SCORE</Text>
                    <Text style={styles.dashboardData}>{this.state.score}</Text>
                  </View>
                </View>
                : <View style={styles.dashboardFront}>
                  <View style={styles.streak}>
                    <Text style={styles.dashboardData}>TIME</Text>
                    <View style={styles.dashboardDataWrapper}>
                      <Text style={styles.dashboardTitle}>{this.props.testMode.timeLeft}</Text>
                    </View>
                  </View>
                  <View style={styles.score}>
                    <Text style={styles.dashboardData}>QUES.</Text>
                    <Text style={styles.dashboardTitle}>{this.props.testMode.questions} ques.</Text>
                  </View>
                </View>

            }

          </View>
        }
        {
          this._rightButton(this.props.rightButtonStyle, this.props.rightButtonAction)
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  openMenu: openMenu,
  nextTestSection: nextTestSection,
  goToChallengeSection: goToChallengeSection,
  toggleNotifications: toggleNotifications,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);