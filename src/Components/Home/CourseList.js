import React, {Component} from 'react';
import {Dimensions, Image, ProgressBarAndroid, Text, TouchableNativeFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styles from './HomeStyles';
import {selectCourse} from "../../Redux/Learn";
import firebaseApp from '../Firebase.js';

firebaseApp.analytics().setCurrentScreen("OngoingCourse");

const vh = Dimensions.get('window').height / 100;

class CourseList extends Component<{}> {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    if (!this.props.data || !this.props.data.length) {
      return <View/>;
    }
    return (
      <View style={styles.courseList}>
        
        <View style={[styles.listWrapper, {height: 15.5 * this.props.data.length * vh}]}>
          {
            this.props.data && this.props.data.map((course, index) => {
              console.log("JJJJJJJJJJJJJJSSSS: "+JSON.stringify(course));
              console.log("LLLLLLLLLLLLLLLSSSS: "+JSON.stringify(course));
              return (
                <TouchableNativeFeedback
                  key={'learnCourseList' + index}
                  onPress={() => {
                    this.props.selectCourse(course);
                    firebaseApp.analytics().logEvent('Course_Loading', {name: course.name});
                    console.log("asdfghjkl"+JSON.stringify(this.props.history));
                    console.log("asdfghjkl1"+JSON.stringify(this.props.goTo));


                    this.props.history.push(this.props.goTo)
                  }}
                >
                  <View style={styles.listItem}>
                    <Image

                      style={styles.courseListIcon}
                      resizeMode={'contain'}
                      source={{uri: course.image}}
                    />
                    <View style={styles.courseListTextContainer}>
                      <Text style={styles.courseListItemHeading}>{course.name}</Text>
                      <Text style={styles.courseListItemTeacherName}>{course.teacher}</Text>
                    </View>
                    <View style={styles.percentComplete}>
                      <View style={styles.percentDataContainer}>
                        <Text style={styles.percent}>{Math.round(course.completion * 1000) / 10}</Text>
                        <Text style={styles.percentIcon}>%</Text>
                      </View>
                      <Text style={styles.completedText}>Completed</Text>
                      <ProgressBarAndroid
                        style={styles.progressBar}
                        styleAttr={'Horizontal'}
                        progress={course.completion}
                        color={'#A06BF4'}
                        indeterminate={false}
                      />
                    </View>
                  </View>
                </TouchableNativeFeedback>
              )
            })
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  selectCourse: selectCourse,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);