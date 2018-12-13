import React, {Component} from 'react';
import {
  AsyncStorage,
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import {bindActionCreators} from 'redux';5
import {connect} from 'react-redux';
import styles from './HomeStyles';
import NavigationBar from '../Basic/NavigationBar';
import {goTo} from "../../Redux/Navigation/NavigationActions";
import Video from './Video'
import Assignment from './Assignment';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import axios from "axios/index";
import firebaseApp from '../Firebase.js';
import Pdf from 'react-native-pdf';
const newStorage = firebase.storage();
import firebase from 'react-native-firebase';
firebaseApp.analytics().setCurrentScreen("OngoingCourse");
import Share from 'react-native-share';


const screen = Dimensions.get('window');

class OngoingCourse extends Component {
  markCompleted = async (chIndex, index) => {
    let {completion} = this.state;
    completion[chIndex][index] = true;
    await this.storeCompletion(JSON.stringify(completion));
    this.setState({completion});
  };
  storeCompletion = async data => {
    try {
      const {name} = this.props.learn.currentCourse;
      await AsyncStorage.setItem(name, data);
    } catch (error) {
      // Error saving data
    }
  };
  storeCurrent = async data => {
    try {
      const {name} = this.props.learn.currentCourse;
      await AsyncStorage.setItem(name + 'current', data);
    } catch (error) {
      // Error saving data
    }
  };
  retrieveCompletion = async () => {
    const {name, chapterData} = this.props.learn.currentCourse;
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        this.setState({completion: JSON.parse(value)});
      }
      else {
        const completion = chapterData.map(chapter => chapter.content.map(_ => false));
        this.setState({
          completion
        });
      }
    } catch (error) {
      const completion = chapterData.map(chapter => chapter.content.map(_ => false));
      this.setState({
        completion
      });
    }
  };
  retrieveCurrent = async () => {
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPP: "+ JSON.stringify(this.props.learn.currentCourse));
    const {name} = this.props.learn.currentCourse;
    try {
      const value = await AsyncStorage.getItem(name + 'current');
      if (value !== null) {
        this.setState({current: JSON.parse(value)});
      }
    } catch (error) {

    }
  };
  handleBackPress = () => {
    if (this.state.playVideo) {
      this.setState({playVideo: false, videoName: ''});
      return true;
    }
    else if (this.state.assignmentData.length) {
      this.setState({assignmentData: []});
      return true;
    }
    return false;
  };


  shareLink=() => {

    const link = 
      new firebase.links.DynamicLink('https://classcast.page/OngoingCourse/'+this.props.learn.currentCourse.courseId+'&apn=com.classcast', 'classcast.page.link')
        .android.setPackageName('com.classcast.android').social.setTitle("Learn "+this.props.learn.currentCourse.name+ " on ClassCast App").social.setImageUrl(this.props.learn.currentCourse.image).social.setDescriptionText('Learn from the best teachers around the country 24 X 7. Be 100% prepared for your exams.');
      firebase.links()
          .createShortDynamicLink(link, 'SHORT')
          .then((url) => {
            const shareOptions = {
            title: "Help your friends score good marks",
            message: "Hey!, I just found this excellent lecture series on " + this.props.learn.currentCourse.name + " to help us prepare for our exams. You must check this out.",
            url: url,
                };
            Share.open(shareOptions);
             
            console.log("KKKKKKKKKKKKKKKKKKKKKKKVVVVVongoing: "+JSON.stringify(url));
          });

  };


  learnNext = async () => {
    const {chapterData} = this.props.learn.currentCourse;
    const {current} = this.state;
    this.markCompleted(current.chapter, current.content);
    await this.storeCurrent(JSON.stringify(current));
    const username = await axios.get('http://api.classcast.in/api/mobile/v0.5/my_user_info')
      .then(res => res.data.username);
    console.log({
      username,
      block_id: current.id,
    });
    let data = new FormData();
    data.append('username', username);
    data.append('block_id', current.id);
    axios.post('http://api.classcast.in/classcast/completion/completed/', data).then(res => {
      console.log("LLLLLLLLLLLLLLLLLLWWW"+JSON.stringify(current));
      if (current.content < chapterData[current.chapter].content.length - 1) {
        if (chapterData[current.chapter].content[current.content + 1].type === 'video') {
          console.log("LLLLLLLLLLLLLLLLLLWWWL"+JSON.stringify(chapterData[current.chapter].content[current.content + 1].name));
          this.setState({
            playVideo: chapterData[current.chapter].content[current.content + 1].url,
            assignmentData: [],
            videoName: chapterData[current.chapter].content[current.content + 1].name,
            current: {
              chapter: current.chapter,
              content: current.content + 1,
              id: chapterData[current.chapter].content[current.content + 1].id,
            },
          });
        }
        else if (chapterData[current.chapter].content[current.content + 1].type === 'assignment'){
          this.setState({
            playVideo: '',
            assignmentData: chapterData[current.chapter].content[current.content + 1].questions,
            current: {
              chapter: current.chapter,
              content: current.content + 1,
              id: chapterData[current.chapter].content[current.content + 1].id
            },
          });
        }
        else {
          this.setState({
            playVideo: '',
            assignmentData: [],
            pdflink: link,
            current: {
              chapter: current.chapter,
              content: current.content + 1,
              id: chapterData[current.chapter].content[current.content + 1].id
            },
          });
        }
      }
      else {
        this.setState({
          playVideo: chapterData[current.chapter + 1].content[0].url,
          assignmentData: [],
          current: {
            chapter: current.chapter + 1,
            content: 0,
            id: chapterData[current.chapter + 1].content[0].id
          },
        });
      }
    }).catch(e => console.log(e))
  };

  constructor() {
    super();
    this.state = {
      id: null,
      idFromLink: null,
      firstLaunchVideo: false,
      urlState: false,
      videoUrl: null,
      chapterData: [],
      playVideo: false,
      videoName: '',
      completion: [],
      pdflink: null, 
      assignmentData: [],
      current: {
        chapter: -1,
        content: -1,
        id: null,
      },
    };
  }

  _storeData = async data => {
    try {
      await AsyncStorage.setItem('alreadyLaunchedVideo', data);
    } catch (error) {
      // Error saving data alreadyLaunched
    }
  };
  
  async componentDidMount() {
    console.log('NNNNNNNNNNNNNNDDDQQ: '+JSON.stringify(this.props.learn.currentCourse.courseId));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const value = await AsyncStorage.getItem('alreadyLaunchedVideo');
    console.log('NNNNNNNNNNNNNNDDDLLLL: '+value);
    if(value == "true"){
      console.log('NNNNNNNNNNNNNNDDDLLLLPP');
      this.setState({firstLaunchVideo: true});
    }
    await this._storeData("true");

    firebase.links()
      .getInitialLink()
        .then((url) => {
          console.log("GGGGGGGGGGGGGGGGGGGBBBBB: "+url.split('/')[5].split('&')[0]);
          if(url.split('/')[5].split('&')[0] != null){
            this.setState({idFromLink: url.split('/')[5].split('&')[0]});
          }
        });

    this.retrieveCompletion();
    this.retrieveCurrent();
    console.log(
      this.props.learn.currentCourse.chapterData
        .reduce((merged, current) => [...merged, ...current.content], [])
    );


  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    console.log("JJJJJJJJJJJJJJSSSSA: "+JSON.stringify(this.props.learn.currentCourse));
    const {playVideo, urlState, videoName, assignmentData, completion, pdflink, id} = this.state;
    const {name, teacher, videos, chapterData, completion: completed} = this.props.learn.currentCourse;
    console.log("JJJJJJJJJJJJJJSSSS: "+name+ teacher);
    if (playVideo) {
      console.log("HHHHHHHHHHHHHHHHHHHYYYY"+videoName);
      return (
         <Video
          video={playVideo}
          name={videoName}
          image={this.props.learn.currentCourse.image}
          id={id}
          courseName={this.props.learn.currentCourse.name}
          courseId={this.props.learn.currentCourse.courseId}
          learnNext={() => this.learnNext()}
          close={() => {
            console.log("aaaaaaaaaaaaaaaaaahhhhpppaarha");
            this.setState({playVideo: false});
            this.setState({urlState: false});
            this.setState({playVideo: null});
          }}
        />
      )
    }
    if(pdflink){
      const source = {uri: pdflink , cache: true};
      return(
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 25,}}>
            <Pdf
                source={source}
                enablePaging={true}
               
                onLoadComplete={(numberOfPages,filePath)=>{
                     console.log("pppppppppppppppppppppppppppppppp111111" + JSON.stringify(source));
                    console.log(`number of pages: ${numberOfPages}`);
                }}

                onPageChanged={(page,numberOfPages)=>{
                    console.log(`current page: ${page}`);
                }}
                onError={(error)=>{
                    console.log("ppppppppppppppppppppppppppppppppp111111111" + error);
                }}
                style={styles.pdf}/>
        </View>
        )

    }

    if (assignmentData.length) {
      return (
        <Assignment
          data={assignmentData}
          learnNext={() => this.learnNext()}
          close={() => this.setState({assignmentData: []})}
        />
      );
    }
    return (
      <View style={[styles.container, {paddingTop: 0, elevation: 100}]}>
        <Image
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
          source={{uri: 'data:image/png;base64,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xIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQEw4gJhxATDiAmHAAMeEAYsIBxIQDiAkHEBMOICYcQEw4gJhwADHhAGLCAcSEA4gJBxATDiAmHEBMOICYcAAx4QBiwgHEhAOICQcQ+/+5r9j7es35wAAAAABJRU5ErkJggg=='}}
        />
        <NavigationBar
          noDashboard={true}
          rightButtonStyle={'NONE'}
          leftButtonStyle={'MENU_WHITE'}/>
        <Text style={styles.sectionTitle}>{name.length > 15 ? name.substr(0, 15) + '...' : name}</Text>
        <View style={styles.topHeader}>
          <View style={styles.headerLeftSection}>
            <Text style={styles.headerSectionTeacherName}>By {teacher} Sir</Text>
            <View style={styles.courseStats}>
              <Image
                style={styles.courseStatImage}
                source={{uri: 'data:image/png;base64,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'}}
              />
              <Text style={styles.courseStatText}>{
                chapterData
                  .reduce((merged, current) => [...merged, ...current.content], [])
                  .filter(content => content.type === 'video')
                  .length
              } Videos</Text>
            </View>
            <View style={styles.courseStats}>
              <Image
                style={styles.courseStatImage}
                source={{uri: 'data:image/png;base64,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'}}
              />
              <Text
                style={styles.courseStatText}>{
                chapterData
                  .reduce((merged, current) => [...merged, ...current.content], [])
                  .filter(content => content.type === 'assignment')
                  .length
              } Assignments</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <View style={styles.circularIndicatorBackground}/>
            <AnimatedCircularProgress
              size={screen.width / 3}
              width={10}
              fill={completed * 100}
              linecap={'round'}
              rotation={180}
              friction={3}
              tension={10}
              tintColor="#b06df2"
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#9357c5"/>
            <View style={styles.tickContainer}>
              <Image
                style={styles.tickIcon}
                source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACCUlEQVR4nO2ZTW7bMBBG33jZhQ6RM/QouYF/uoiDHCCwUNgnKOQEaJQEyD6HC1S0W3YjFYGt2hJFmqQ0344GbPI9UCJnDBqNRqPRaKYaCb2AEKk2+4XAD4N5n5yAX5v9CvhZD/9MSsABPAaWs4DruWiO4EVW2W79PIkd0Aq/vSlhAi/BU/AwcgHn4GHEArrAw0gFdIWHEQroAw8jE9AXHkYkwAYeYBQXoSp/WGIBDyPYAVX+sBRjnpqxgWW2Wz93/X7SAobCQ8ICXMBDogJcwUOCAlzCQ2ICXMNDQgJ8wEMiAnzBQwICfMJD5ALq7u2/G51reIhYwCXgAaTaFG+CXBu48zGBTY7gxSyy7e2Lj7lmglwDXwTKuqgImkvCA8wM3DUDMeYppIRLwwPM6m3/rfkglIQQ8PDpJWjbUHCRUPBwcAqEkBASHlqOwbb/z3ydDqHh4T/3AN+3L4gDHk5chHxKiAUeTjRFs+1NaURWzVigrDb7xdAJq7yYxwIPZ7rCrRLyYm47WZUXczHS7CITGh461gJHj4PFwo/gYZHt1q99fsNHOhdDQ57bWOGhZzVoIyFmeLAoh/tIiB0eLPsBBxJawVKAhwENkVMSUoGHgR2hNlDESCrw4KAldiDhc6KHB0c9wRYJScCDw6ZoLaEESAXeeT6+P179vi++hl6HRqPRaDQajUZzPn8BMmi2gHk68xQAAAAASUVORK5CYII='}}
              />
            </View>
            <View style={styles.pointsScoreContainer}>
              <Text style={styles.pointScoreValue}>{Math.round(completed * 1000) / 10}%</Text>
              <Text style={styles.pointScoreTitle}>Completed</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{width: '100%'}}>
          {
            completion.length ? chapterData.map((chapter, chapterIndex) => {
              return (
                <View
                  style={styles.chapterCard}
                  key={'chapterCards' + chapterIndex}>
                  <View style={styles.chapterSectionTitleSection}>
                    <View style={styles.chapterSectionTitleIcon}/>
                    <Text style={styles.chapterSectionTitleText}>{chapter.title}</Text>
                  </View>
                  <View style={styles.chapterCardContent}>
                    {
                      chapter.content.map((content, index) => {
                        let lineStyle = {};
                        if (chapter.content.length === 1) {
                          lineStyle = {
                            height: 0,
                          }
                        }
                        else if (index === 0) {
                          lineStyle = {
                            top: '50%',
                            height: '50%',
                          }
                        }
                        else if (index === chapter.content.length - 1) {
                          lineStyle = {
                            top: 0,
                            height: '50%',
                          }
                        }
                        if( !this.state.firstLaunchVideo  && content.id.split('@')[2] == this.state.idFromLink) {
                          console.log("JJJJJJJJJJJJJJJJJJJJJJJEEEELLL: "+content.id.split('@')[2]);
                          this.setState({firstLaunchVideo: true});
                          this._storeData("true");
                          const ref = newStorage.ref(content.url.split('https://storage.googleapis.com/')[1].replace(/%20/g," "));
                          ref.getDownloadURL().then(function(url) {
                                  console.log("MMMMMMMMMMMMMMMMMMMMEEEEEK: "+url);
                                  this.setState({
                                    playVideo: url,
                                    id: content.id.split('@')[2],
                                    videoName: content.name,
                                  });
                                }.bind(this));
                        }
                        return (
                          <TouchableNativeFeedback
                            onPress={() => {
                              if (content.type === 'video') {
                                console.log("JJJJJJJJJJJJJJJJJJJJJJJEEEE: "+content.name);
                                const ref = newStorage.ref(content.url.split('https://storage.googleapis.com/')[1].replace(/%20/g," "));
                                console.log("MMMMMMMMMMMMMMMMMMMMEEEEEK: "+JSON.stringify(ref));
                                ref.getDownloadURL().then(function(url) {
                                  console.log("MMMMMMMMMMMMMMMMMMMMEEEEEK: "+url);
                                  this.setState({playVideo: url});
                                }.bind(this));
                                this.setState({
                                  id: content.id.split('@')[2],
                                  videoName: content.name,
                                  current: {
                                    chapter: chapterIndex,
                                    content: index,
                                    id: content.id,
                                  }
                                })
                              }
                              else if(content.type === 'assignment') {
                                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH1: "+content.info);
                                this.setState({
                                  assignmentData: content.questions,
                                  current: {
                                    chapter: chapterIndex,
                                    content: index,
                                    id: content.id,
                                  },
                                })
                              }
                              else {
                                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH2: "+content.info);
                                this.setState({
                                  pdflink: content.info.slice(3,-4),
                                  current: {
                                    chapter: chapterIndex,
                                    content: index,
                                    id: content.id,
                                  },
                                })
                              }
                            }}
                          >
                            <View
                              key={'chapterContentItems' + index}
                              style={styles.content}>
                              <View style={[
                                styles.progressLineIndicator,
                                {
                                  backgroundColor: completion[chapterIndex][index] ? '#56b64a' : '#a4a4a4'
                                }
                              ]}/>
                              <View style={[
                                styles.contentLine,
                                lineStyle
                              ]}/>
                              <View style={styles.contentIconContainer}>
                                <Image
                                  style={styles.contentIcon}
                                  source={
                                    content.type === 'video'
                                      ? {uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAMAAACfvvDEAAACBFBMVEUAAAAyY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84wYc4yYs4yY84yY84yY841ZM4sXcwfVMgvYc40ZM4yY84nWstAbdG9zO98m98fWMgfVMk1Zc8yY84yY84fVclagdf///+ww+wwYc0xYc4yY84yY85Vfdbn7flehNcfV8chVsoyY84yY86ht+gpXMsfV8gzY84yY87h6PhYgNYfWccjV8oyY84yY86ZseYlWcoyY87Z4vVNeNQmWssyY86Rq+QfVsgyY84yY87P2vNHc9IoW8wyY86HpeI2Zc8yY87H1PFGctIpXMwyY87k6vktXswyY87W3/VVfdUoW8syY86Wr+UkWcoyY84yY87e5vckV8oyY84yY84nW8syY85cg9ciVsoyY84yY86pvuoyY84yY87u8fpojdsyY840Zc4yY8709vxvkdwyY865yu48atAuX80yY84yY84lWstCb9HM2POKpeIyY84yY84yY84xYs4yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY84yY86VH/uZAAAArHRSTlMAGlmTvdnr8uzawJZfH02v+f/+tlZe0dhmG7G8Jkzz/Ft3ZXhG//9aD/3//////x7/////////0FT///////9q4///////8UT/////uf/////PE///I////3D//6vC////3f//7f///+///+7////f///kxP//0pv/YP//dhf/KcH//9f/ZP//+P///3XJ/////9wZKv+JbsPONnHneQJhyGkIK22ny+DNqnMwivR6DgAAAfFJREFUeJyN1Pk7lFEUB/CjZIToZi1lDRkvUdNEx76UJnqJChNaVJrSlPYoURQJRaFIi7T4J81r3vUu79P3x3M/z3me+9xzLoAlIVu2hm4Lc4Rvj4iM2gHiRMfsJEZ2xcYJXHwCoZOYxHG79zBOSfJeGu5L4UJCUtOsMEnglKSbYYYNJCTTgPuNalY2h+Zo8ECuVnLmSVJ+AUsPqjJZrxQWHTrsOuJm5NEgLDYqJccQS8tc5Uzbik1ZaZJViFhdU1tHtz2uwBOEkoj1Jz3kFHupBlZi42m5ydq2GeAM4UjEllZPtqXtWcjhSzx3Xm5zmo7aIVIgETtKvAVG2wvQKZTY1S1f1Ns2wyWxRLwsea+oR5XQYyfx6rXr6iD0QoqtxBteX/DIATdt5a2+20Tr6beTd+563er1++GeWN7vkx/oL/UQHgll/WPz68fAE4GsfuoaMD/9IDzjy+f0lA4BvODI4RGZmvyXyhfDytJXtVnU2I8qoxxGybHXLslNDfKb4H9kkoE9Gp+Q3zJ7NBlcuXd6YWp65r2HaUjIB3WLZ/WK01cn+Tj7Pqd9DXFGzfeRaajt8GYG2VNTPpm/sMz/hQBRQjhPf7VzC1y3+JmGgXzxM25pmeMC+bpiWVTy7fsPPlTyc/XXmj/c0fP7z99/69ajDXMFvOBqW90eAAAAAElFTkSuQmCC'}
                                      : {uri: 'data:image/png;base64,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'}
                                  }
                                />
                              </View>
                              <Text style={styles.contentName}>{content.name}</Text>
                              
                              { content.type !== 'PDF' &&
                              <Text style={styles.contentDescription}>{content.info}</Text>
                            }
                            { content.type === 'PDF' &&
                              <Text style={styles.contentDescription}> Supplementary Material</Text>
                            }
                            </View>
                          </TouchableNativeFeedback>
                        )
                      })
                    }
                  </View>
                </View>
              )
            }) : null
          }
        </ScrollView>

      <TouchableNativeFeedback onPress={()=> this.shareLink()}>
        
       <View style={styles.sharebox}>
            <Image
                 style={styles.shareIcon}
                 source={{ uri: 'data:image/png;base64,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'}}   
                 />
          </View>
         </TouchableNativeFeedback>
      </View>
     

    )
  }
}

const mapStateToProps = state => ({
  section: state.navigation.currentSection,
  learn: state.learn,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  goTo: goTo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OngoingCourse);