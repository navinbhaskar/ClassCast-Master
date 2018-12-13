import React, {Component} from 'react';
import {ActivityIndicator, Image, Slider, StatusBar, Text, TouchableNativeFeedback, View, BackHandler} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './VideoStyles';
import VideoPlayer from 'react-native-video';
import {changeOrientation} from "../../Redux/App";
import {ImageCacheManager} from "react-native-cached-image";
import firebaseApp from '../Firebase.js';
import {userDataUpdate} from "../../Redux/User/UserActions";
import firebase from 'react-native-firebase';
import Share from 'react-native-share';
firebaseApp.analytics().setCurrentScreen("Video");
const newStorage = firebase.storage();



class Video extends Component {
  getTime = sec => {
    console.log("aaaaa");
    let s = parseInt(sec);
    let m = Math.floor(s / 60);
    s = s % 60;
    s = s >= 10 ? s : '0' + s;
    m = m >= 10 ? m : '0' + m;
    return `${m}:${s}`
  };
  onLoad = (data) => {
    console.log("Buffering__onLoad");
    this.setState({
      loaded: true,
      paused: false,
      duration: data.duration,
      back: false,


    });
     firebaseApp.analytics().logEvent('Video_Loaded', {video: this.props.name});
  };
  onProgress = (data) => {
    console.log("Buffering1");
    this.setState({
      currentTime: data.currentTime,
      playableDuration: this.state.duration,
      seekableDuration: this.state.duration,
      paused: false,
      buffer: false
    });
  };
  onEnd = () => {
    firebaseApp.analytics().logEvent('Video_Ended', {video: this.props.name});
    console.log('VideoEnded'+this.props.name);
    setTimeout(() => this.props.learnNext(), 100);
    this.setState({paused: true});
  };
  onBuffer = (data) => {
    this.setState({buffer: true});
    currentTime: data.currentTime,
    console.log("Buffering");
  };
  onAudioBecomingNoisy = () => {
    this.setState({paused: true})
  };
  onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
    this.setState({paused: !event.hasAudioFocus})
  };

  shareLink=() => {
    console.log("LLLLLLLLLLLLLLLLLLWWWW: "+this.props.id);
    const link = 
      new firebase.links.DynamicLink('https://classcast.page/OngoingCourse/'+this.props.courseId+'/'+this.props.id+'&apn=com.classcast', 'classcast.page.link')
        .android.setPackageName('com.classcast.android').social.setTitle(this.props.name).social.setImageUrl(this.props.image).social.setDescriptionText('Learn from the best teachers around the country 24 X 7');
      firebase.links()
          .createShortDynamicLink(link, 'SHORT')
          .then((url) => {
            const shareOptions = {
            title: "Help your friends score good marks",
            message: "Hey! I just found an excellent video lecture on " + this.props.courseName + " to help us prepare for our exams. You must check this out.",
            url: url,
                };
            Share.open(shareOptions);
             
            console.log("KKKKKKKKKKKKKKKKKKKKKKKVVVVVongoing: "+JSON.stringify(url));
          });

  };

  constructor() {
    super();
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentPosition: 200.0,
      currentTime: 0.0,
      paused: false,
      seek: 0,
      showControls: false,
      showSettings: false,
      loaded: false,
      buffer: false,
      videoUrl: 0,
    };
  }

  componentDidMount() {
    console.log("HHHHHHHHHHHHHHHHHHHYYYY: "+this.props.courseId);
    console.log("HHHHHHHHHHHHHHHHHHHYYYY: "+this.props.id);
    this.props.changeOrientation(false);
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.goBack;
    });
  }
  /*
  componentWillMount() {
    console.log("MMMMMMMMMMMMMMMMMMMMEEEEEKK: "+this.props.video.split('https://storage.googleapis.com/')[1].replace(/%20/g," "));
    const ref = newStorage.ref(this.props.video.split('https://storage.googleapis.com/')[1].replace(/%20/g," "));
      console.log("MMMMMMMMMMMMMMMMMMMMEEEEEK: "+JSON.stringify(ref));
      ref.getDownloadURL().then(function(url) {
        console.log("MMMMMMMMMMMMMMMMMMMMEEEEEK: "+url);
        link= url;
      }.bind(this));
  }
  */
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.props.changeOrientation(true);
  // {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  //}

  }

  renderVideo() {
    console.log("aaaaaaaaaaaaaaaaaahhhhppp: "+this.props.video);
    console.log("aaaaaaaaaaaaaaaaaahhhhppp: "+this.props.courseName);
    return(

      <VideoPlayer 
        ref={(ref: Video) => {
          this.video = ref
        }}
       
        source={{uri: this.props.video}}
        //source={require('https://www2220.playercdn.net/188/0/8LyiPlhQABkCRLkcegW7PQ/1529143333/180605/9H3OzRRvcEDhQjY.mp4')}
        style={styles.fullScreen}
        rate={this.state.rate}
        paused={this.state.paused}
        volume={this.state.volume}
        muted={this.state.muted}
        resizeMode={this.state.resizeMode}
        onLoad={this.onLoad.bind(this)}
        onBuffer={this.onBuffer}
        onProgress={this.onProgress}
        progressUpdateInterval={1000}
        onEnd={this.onEnd}
        onError={(error) => {console.log('videoError: '+JSON.stringify(error)) }}
        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
        onAudioFocusChanged={this.onAudioFocusChanged}
        repeat={false}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <TouchableNativeFeedback
          style={styles.fullScreen}
          onPress={() => {
            this.setState({showControls: !this.state.showControls});
            setTimeout(() => this.setState({showControls: false}), 10000);
          }}
        >

          { 
            this.renderVideo()
          }
        </TouchableNativeFeedback>
        {
          !this.state.loaded && <ActivityIndicator size="large" color="#5e4096"/>
        }
        {
          this.state.loaded && this.state.buffer && <ActivityIndicator size="large" color="#ffffff"/>
        }
        {
          this.state.showControls &&
          <View style={styles.controls}>
            <Text style={styles.videoTitle}>{this.props.name}</Text>
            <TouchableNativeFeedback
              onPress={() => this.setState({showSettings: !this.state.showSettings})}
            >
              <Image
                style={styles.settingsIcon}
                resizeMode={'contain'}
                source={{uri: 'data:image/png;base64,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'}}
              />
            </TouchableNativeFeedback>
            {
              this.state.showSettings && this.state.loaded &&
              <View style={styles.generalControls}>
                <Text style={styles.controlTitle}>Playback Speed</Text>
                <View style={styles.rateControl}>
                  {this.renderRateControl(0.5)}
                  {this.renderRateControl(0.75)}
                  {this.renderRateControl(1.0)}
                  {this.renderRateControl(1.25)}
                  {this.renderRateControl(1.5)}
                </View>
              </View>
            }
            {
              !this.state.showSettings && this.state.loaded &&
              <TouchableNativeFeedback
                onPress={() => this.setState({paused: !this.state.paused})}
              >
                <Image
                  style={styles.playIcon}
                  resizeMode={'contain'}
                  source={{
                    uri:
                      !this.state.paused
                        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAABfklEQVR4nO3SwU3DUBRFQRspTSDKBdqA4mLaeGxYsbWjODkzBVy/b51lAQAAAAAAAAA42MxcZuZ9ZrY5zva3eXn2+x7ezHwe+GP/+3j2+/Za733AzGzLsrzeaH5b1/Vtz8DZ79vrDAHMLffXdd31xrPft9fLPT/O/QkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHEnSGAnxtubwdsnP2+Xc4QwNcNt78P2Dj7fY9tZi4z8z4z1znO9W/z8uz3AQAAAAAAAAD89wvZ40hJ20f6WgAAAABJRU5ErkJggg=='
                        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGklEQVR4nO3dTahVZRTG8WdVhIQUhkGDoJmJGSmJQvQ1SYgaNIioqJBAJ9qHimIRDsJJEuWkD8iCMgqlcGBGKaSRFomgRpYK3UgylVsJEmR+3H+D3YGbnO7X2Xuvfc55fqM7e5+XtXjX2Zz77iOZmZmZmZmZmZmZmZmZmZmZTRBwB7AFOA4MAp8A92TnshoAK4ELtLcNmJ6d0SoCzAPO/0/xW84Ca4HJ2XmtZMCmUYo/3C/Aw9mZrUTAwDgaoGUnMDM7u5VgAsVvOQesA67K3oN1oIMGaDkBLAAiey82ASU0QMtuYHb2fmycSmwAKB4lXwOmZO/LxqjkBmgZBBYBl2Tvz0ZRUQO07AHmZu/RRlBxAwAMAeuBqdl7tTZqaICWP4DFwKXZe+4mlT9aAVS9xkX2S1oSEbtrXrcr9eKHqFmSdgHvAtdmh2m6XmyAlsckHQaWAZdlh2mqXhwB7XyvYizsyA7SNL18Agw3Q9LnwEbguuwwTdIvDdDyoKRDwCrg8uwwTdAvI6CdI5KeiojPsoNk6rcTYLhpkj4FNgPXZ4fJ0s8N0HK/pB+A1cCk7DB16+cR0M6ApGciYkt2kLq4AdrbKunpiPgxO0jVPALau1fSQWANcEV2mCr5BBjdUUnLI+LD7CBVcAOM3XYVj42HsoOUySNg7O6W9C09doHFJ8DE/CppRUS8nx2kU26Aznyh4kum77KDTJRHQGfulLSPLr7A4hOgPCclrZL0TkR0zZ7dAOX7SsVY2JcdZCw8Asp3q6S9wOvA1dlhRuMToFq/S3pO0vqIGMoO044boB57VYyFb7KDXMwjoB5zJH0NvAVckx1mODdAfULSEyr+U3lJUy6weATkOaBiLOzKDOETIM/Nkr4ENmReYHED5HtUiRdYPAKapfYLLD4BmqV1geWluhZ0AzTTcmBlHQt5BDTXGUkzIuKnKhfxCdBckyQtrHoRN0Cz3Vf1Am6AZqv8ypoboM+5AZrt56oXcAM029aqF/BjYHOdkXRjRAxUuYhPgOZ6oeriSz4BmurliFhex0J+fVqzHJT0pL8M6j+nJS2TNKvuV9n5BMiFpPckrYyIExkB3AB5DkhanP1OY4+A+p2StETSLdnFl3wC1AlJb0t6NiIGs8O0uAHqsVfFcb8nO8jFPAKq9ZukRZLmNbH4kk+AqgxJekPS8xFxKjvMSNwA5fP18D51UtICSbd1S/ElN0AZzktaJ2laRHTV20Ekj4BO+SVRfeqYpEci4q5uLr7kBhivc5LWSpoeER9khymDR8DYbVfxVe3h7CBl8gkwuqOSHoiI+b1WfMkNMJK/Ja1Rcdx/lB2mKh4B7fXND0a4Af5rQEXhP84OUhePgMJfklaruI3bN8WXfAJI0mZJSyOi8ls4TdTPDXBExWPdtuwgmfpxBPyp4q3eN/V78aX+OwE2qvgBqGPZQZqiXxrgoIovbXZmB2maXh8BpyUtVXHhYmdylkbq1RMASRtUXLg4mR2myXqxAfarOO7T/+e+G/TSCDglabGkOS5+g1C9IeBNYGr2Xq2Niou/B5ibvUcbQUWFHwQWAr00wnpTyYW/ALwKTMnel41RicXfDczO3o+NUwmFPw48DlT+PiOrQAeFPwe8AlyZvQfrADAwgeLvAGZmZ7cSAJvGUfhfgIeyM1uJgHnA+VEKfxZ4EZicndcqAKygeIRrZxtwQ3ZGqxhwO7CF4lP9yX//np+dy8zMzMzMzMzMzMzMzMzMzKzX/ANcwvqrHCtF+QAAAABJRU5ErkJggg=='
                  }}
                />
              </TouchableNativeFeedback>
            }
            <View style={styles.trackingControls}>
              <Text style={styles.timeLabelText}>{this.getTime(this.state.currentTime)}</Text>
              <Slider
                style={styles.seek}
                minimumTrackTintColor={'#5e4096'}
                maximumTrackTintColor={'rgba(255,255,255,1)'}
                thumbTintColor={'#5e4096'}
                value={this.state.currentTime / this.state.duration}
                onValueChange={value => {

                  this.setState({
                    currentTime: value * this.state.duration
                  });
                  //firebaseApp.analytics().logEvent('Video_seeked', time: currentTime);
                 
                  this.video.seek(value * this.state.duration)}}

              />
              <Text style={styles.timeLabelText}>{this.getTime(this.state.duration)}</Text>
            </View>
            <TouchableNativeFeedback onPress={()=> this.shareLink()}>
              <View style={styles.sharebox}>
              <Image
                   style={styles.shareIcon}
                   source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiDAQLLiWRnFj1AAAHkUlEQVR42uWdaWwVVRiGv+ktLQhVsWyttgUUMBglUYyKRBQF3FBEKApGwQU1IRITVIKYmKDEDcSSgEsiagTXsEgUBA0RjEqiooKYFtS6cK9YNivUUkoff0Dpwr13zsydr2cmfL+Zl+95Zzp35pz3nHEk8kWWDJKrpUQKpFAKJFcSEpeExGWDrHYO2O5OFz3GdbzCTlLVf3zAJE613acW/k38hEntZTodbHcbNPwQvjKCb6wdTCbbdtdBwWfxlCf4xlrHabZ7DwK/E8t94QNs52zb/WeKX8R3vvEB9jHMNkMm+CfzY0b4ADUMtM3hFz/GqozxAf6kwDaLPwPmBYIPsJH2tmm8448ODB9gvm0er/jZVARqwCH6HlHOso1mWHdLn0D1smW2bSQPxUnEAz3/R+pikahcARNF4749IzoGjFZRHU6nSBhAZxmiIpwr10TCALletN7jRkXDgJFqytfhRMGAs9SUT5GuUTCgUFG7IPQGkC1dFeULQ2+AdFe9T0XAgJNU1fPCb8BvclhRfWfoDXDqpFJRPhF6A0SkQlE7HgUDyhW1T/ArYJvzb+gN4FQ5X018mW06N/g8HmOvwlBIY11imzAdfEems0sRHhI4ovaimRl8B7lfHpFuyv/NEgfbpMngc5miMgLYuv5B8x3DJ3w77uX3NoAHmGGbtjV8jEn80kbw8GeoIhNkMSHgiQ+3utk2cxO8QylbDVr+noepDQj/SdvUTfij+N6g4a2U4ohwA4cCwF+BY5v7CPy1fG3Q7jZu49jzKuM5nCH+D+T5a9ehBxcwkis5i9yM4YfxpUGzv3Jn62gT92aEv8ZzaI48xvImldQ1k2kgzpcs8PcoyRDWG7T6B/fRLunxY6jyiV9GzNs5H8dqDqaVrGAmJR40B/GJQaMJHkh3ldGNpZ7hq7nb23kaavQXeuR6WGLyVMVAo4hLFdNMfqOZwB5j+DrKPD330cdzGqeKCWkVB7DCQGUPM+hk3GU+U9nkqnmQtzjT27kf5vMV9EOKkuqdw3s0uB79D49ziqdGG619PkVaeC+LGcfJ6Y8/7heRB2SueLlVNK+EDHG2tVDrK4/LONeR/QNSJs85e3z+ryJCvhRLiRRLiXQ4lhbf4tR7F5rv69w31R/0PqbVm9eodz2ihjmheS/jwQzxASopFqGYlw2e2mqZH6LMHiMMzpdJ/cwClx9PgDpeSn7PsIXfV3X0rWXVs4hetolbG2DydBZEHWZxY0YvRMUNbQLfwHv0t82aDD9m9Eaeaa1ggG3SVAZMVodfxYW2KdMZsEkV/lMG2SZMj99TEX4Dl9vmS1/ZIjJKTX2i87ptQLfKEpGb1NTDOPPS2gBy5FI19cG28QwMkB6+3/3cK9w3v6MGaMYQe9rGMzFA822so/n4jj0DNK8AkR62Ad0N0K1a24DuBsQV1Wtkh21AdwMSiuoVocxgtDJA8wrQjDgGZsBfillczYhjUAY4dbJeTT0SV4DIcjX1mdxC6KOYQrHqaMBmRockkJDGgm9ULYBv0Vv5FYgBdykbALCREbY5UxsQY0sbWACfc4Vt1lQWXN8mBgCsI5yjBHzWZhbAx1xkm/d4A9pyagxgJXrrAHxaENTkaDn9mEW1679rYCnn2qZuaUEw0+NFIiLk8xT7DUx4O1S7O2UckEjQbKkz3ZjLf67HHOYN9BZIu1SwEZldMtTZ3EqvUGbIPZLjcmS9vCGznEq/GHSXEimRnkcjMgmJS1w2OXX+xPyGpJaRYgCMIl5qEbRMXnUs5AzP3Z7Hs+xIqlfNO9zqJ3jlJya3m/Eumr1YZHCTreUFDMcRyWeaQdS6jreackteTDAPStbzjlnT9GGxQdi5hufcY1OU8rfx6TnIPPK9W2ASlS1nOqd7Uu3Puwapwf3MTr39IT1YZgzfWPu4w8d10Cws3dyIQ1SynoV+p70ZYLQpYoroJKUeQrIta46nsPRx10MXzmU4gynKQKZJbyAfGbS8h0dbTq5we0YrBlaHao9ZLmGtQdNVPMTRbRQsLphQM+Eyo9ewv5hKe0oDeVhfGbphOq7iC4PG44GsGAJ42jZxMhPMVhAFVbfY5k1uwo1Ga8iCqDi6m7P4tsBhbAA7x5rUTNusqU1om3Wk1aEJ6Sc1IcZE9ZXEc2xTupnQjsmqa8l3hH7CRoQcpqR42Q2iwhzfbWbCpWoGPBGNDRX1cow3RsMAnR1FRUTOISf8twFhp+J2KiWhvwKISRdF+QjsJ5iv+mca/i01xftYnpfqHn4DqlXVw7+ZmuyUBkX18O8n6NRL1QltgIhqlDMSGypuV1OucqqjYMCHmsrRMEArzLsiEgY4u+QLFeFaWRsJA0Rr7881kfkcI3keZoLN62LbXF4smBI4/vu2mbwZ0I7tgeJH7UNLziF5JFDBF50IrGVoVZQFdv6j+LE1EWKsCQQ/qp/bE6Ez5RnjR/eDiyIi9Mww2L830p/cFBEhj5W+8cvpZ7v/ICzI4hlf+GvpbLv34Ey4nI2e4H9nUhDRrlAVYwxvibuZFsmfPQMLshnJq2m2WK1hGXek31IxAjNDrjbEZLAMl2IplAIplJyj2ynG5TNZ49S4Hf0/ksQnEjaX7XMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTItMDRUMTE6NDY6MzcrMDE6MDAIEm3BAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEyLTA0VDExOjQ2OjM3KzAxOjAweU/VfQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='}}   
                   />
            </View>
          </TouchableNativeFeedback>
          </View>
        }
      </View>
    )
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  };

  renderRateControl(rate) {
    const isSelected = (this.state.rate === rate);

    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({
          rate,
          showSettings: false,
        })
      }}>
        <Text style={[styles.controlOption, {
          fontWeight: isSelected ? 'bold' : 'normal',
          opacity: isSelected ? 1 : 0.4,
        }]}>
          {rate}x
        </Text>
      </TouchableNativeFeedback>
    );
  }

  renderResizeModeControl(resizeMode) {
    const isSelected = (this.state.resizeMode === resizeMode);

    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({resizeMode})
      }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? 'bold' : 'normal'}]}>
          {resizeMode}
        </Text>
      </TouchableNativeFeedback>
    )
  }

  renderVolumeControl(volume) {
    const isSelected = (this.state.volume === volume);

    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({volume})
      }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? 'bold' : 'normal'}]}>
          {volume * 100}%
        </Text>
      </TouchableNativeFeedback>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changeOrientation: changeOrientation,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Video);