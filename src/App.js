import React, {Component} from 'react';
import {Animated, Dimensions, StatusBar, StyleSheet, TouchableWithoutFeedback, View, AsyncStorage} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Login from './Components/Login/Login';
import Playground from './Components/Playground/Playground';
import Home from './Components/Home/Home';
import Menu from './Components/Menu/Menu';
import {closeMenu} from './Redux/Navigation/NavigationActions';
import Orientation from 'react-native-orientation';
//import NotificationPanel from './Components/Notifications/NotificationPanel';
import {BackButton, NativeRouter, Redirect, Route, Switch} from 'react-router-native'
//import axios from 'axios';
import Test from "./Components/Playground/Test/Test";
import ChallengeAFriend from "./Components/Playground/ChallengeAFriend/ChallengeAFriend";
import ConceptGym from "./Components/Playground/ConceptGym/ConceptGym";
import Modal from './Components/Modals/Modal';
//import {NotificationsAndroid} from 'react-native-notifications';
//import Teachers from './Components/Login/Teachers';
//import Teachers from './Components/Modals/AddTeachers';
import Teacher_Redirect from './Components/Login/Teacher_Redirect';
import RNFirebase from 'react-native-firebase';

const firebaseApp = RNFirebase.initializeApp({ debug: true });
firebaseApp.analytics().logEvent("myEvent");
 //let Analytics = firebase.analytics();


const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;

const customTextProps = {
  style: {
    fontFamily: 'Montserrat-Regular',
  },
};

// setCustomText(customTextProps);

class App extends Component<{}> {
  router = ({currentSection}) => {
    let components = [
      <Login/>,
      <Playground/>,
      <Home/>,
    ];
    return components[currentSection[0]];
  }


  clearAsyncStorage = async() => {
    await AsyncStorage.setItem('matresume', 'null');
    await AsyncStorage.setItem('phyresume', 'null');
    await AsyncStorage.setItem('chemresume', 'null');
    await AsyncStorage.setItem('flashcardData', 'null');
    
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('expireTime');
      await AsyncStorage.setItem('alreadyLaunched', 'null');
      await AsyncStorage.setItem('alreadyLaunchedVideo', 'null');
      console.log("BBBBBBBBBBBBBSSSAAcacheTime: "+new Date(value).getTime());
      const cacheTime = new Date(value).getTime();
      if (value == null) {
        this._storeData();
        console.log("BBBBBBBBBBBBBSSSAAif");
      }
      else {
        console.log("BBBBBBBBBBBBBSSSAAelse");
        const now = new Date();
        let currentTime = new Date(now);
        currentTime.setMinutes(now.getMinutes()+2);
        let epoch = currentTime.getTime()
        console.log("BBBBBBBBBBBBBSSSAAcurrentTime: "+ epoch);
        if(cacheTime < epoch){
          console.log("BBBBBBBBBBBBBSSSAAelseif");
          this.clearAsyncStorage();
          this._storeData();
        }
      }
    } catch (error) {
      console.log("nnnnnnnnnnnnnnnnnnnnnnnnn: "+ error);
    }
  };

  _storeData = async() => {
    try {
      const now = new Date();
      let expireTime = new Date(now);
      expireTime.setMinutes(now.getMinutes() + 30);
      const cacheTime = expireTime.getTime();
      await AsyncStorage.setItem('expireTime', expireTime);
    } catch (error) {
      console.log("BBBBBBBBBBBBBSSSerror: "+error);
    }
  };

  constructor() {
    super();
   // Analytics.setAnalyticsCollectionEnabled(true);
   // Analytics.setCurrentScreen('main_screen', 'App');
    //Analytics.logEvent('app_open', {
     // id: 'something',
      //time: 'another'
    //});
    this.state = {
      menuOpen: false,
      shift: new Animated.Value(0),
      scale: new Animated.Value(1),
    }
  }

  componentDidMount() {
    const {portrait} = this.props.app;
    if (portrait) {
      Orientation.lockToPortrait();
    }
    else {
      Orientation.lockToLandscape();
    };
    //this.clearAsyncStorage();
    this._retrieveData();

  }

  componentDidUpdate() {
    const {portrait} = this.props.app;
    if (portrait) {
      Orientation.lockToPortrait();
    }
    else {
      Orientation.lockToLandscape();
    }
    let {menuOpen} = this.props.navigation;
    if (menuOpen) {
      Animated.spring(
        this.state.shift,
        {
          toValue: 1,
          friction: 4,
          tension: 4,
        }
      ).start();
      Animated.spring(
        this.state.scale,
        {
          toValue: 0.85,
          friction: 4,
          tension: 4,
        }
      ).start();
    }
    else {
      Animated.spring(
        this.state.shift,
        {
          toValue: 0,
          friction: 4,
          tension: 4,
        }
      ).start();
      Animated.spring(
        this.state.scale,
        {
          toValue: 1,
          friction: 4,
          tension: 4,
        }
      ).start();
    }
  }

  render() {
    const transform = this.state.shift.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.75 * screen.width],
    });
    return (
      <NativeRouter>
        <View style={[styles.container, this.props.app.portrait ? {} : {width: screen.height}]}>
          <StatusBar hidden={true}/>
          <Route path="/" component={Menu}/>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  {translateX: transform},
                  {scaleX: this.state.scale},
                  {scaleY: this.state.scale},
                ],
              },
              this.props.app.portrait ? {} : {width: screen.height}
            ]}>
            <BackButton>
              <Switch>
                {
                  !this.props.user.email &&
                  <Route exact path="/" render={() => <Redirect to={'/login'}/>}/>
                }
                <Route exact path="/login" component={Login}/>
                <Route path="/Teacher_Redirect" component={Teacher_Redirect}/>
                <Route path="/concept" component={ConceptGym}/>
                <Route path="/test" component={Test}/>
                <Route path="/challenge" component={ChallengeAFriend}/>
                <Route path="/" component={Home}/>
          
              </Switch>
              {
                this.props.navigation.menuOpen &&
                <TouchableWithoutFeedback
                  onPress={() => this.props.closeMenu()}
                >
                  <View style={styles.overlay}/>
                </TouchableWithoutFeedback>
              }
            </BackButton>
          </Animated.View>
          
          {
            this.props.app.modal
              ? <Route path="/" component={Modal}/>
              : null
          }
        </View>
      </NativeRouter>
    );
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation,
  user: state.user,
  app: state.app,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  closeMenu: closeMenu,
}, dispatch);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  overlay: {
    width: screen.width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100000,
    height: screen.height,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
