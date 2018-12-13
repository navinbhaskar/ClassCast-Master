import React, {Component} from 'react';
import {DatePickerAndroid, Image, Keyboard, Text, TextInput, TouchableNativeFeedback, View,} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './LoginStyles';
import ImagePicker from 'react-native-image-crop-picker';
import {userDataUpdate} from "../../Redux/User/UserActions";
import {goTo} from "../../Redux/Navigation/NavigationActions";
import SplashScreen from 'react-native-splash-screen';
import Modal from 'react-native-modal';
import firebase from 'react-native-firebase';

const database=firebase.database();

class Fields extends Component<{}> {
  selectimage = () => {
    ImagePicker.openPicker({
      width: 600,
      height: 600,
      cropping: true,
      includeBase64: true
    }).then(image => {
      let photo = 'data:' + image.mime + ';base64,' + image.data;
      this.props.userDataUpdate({
        ...this.props.user,
        photo
      })
      const challenge = database.ref('/display_pic/');

          challenge.on('child_added', snap => {
              challenge.child(this.props.user.id).update({
            id: this.props.user.id,
            photo: photo
              });
          });

    });
  };
  captureimage = () => {
    ImagePicker.openCamera({
      width: 600,
      height: 600,
      cropping: true,
      includeBase64: true
    }).then(image => {
      let photo = 'data:' + image.mime + ';base64,' + image.data;
      this.props.userDataUpdate({
        ...this.props.user,
        photo
      })
      const challenge = database.ref('/display_pic/');

          challenge.on('child_added', snap => {
              challenge.child(this.props.user.id).update({
            id: this.props.user.id,
            photo: photo
              });
          });

    }).catch(e => console.log(e));
  };
  verifyName = name => {
    return {
      valid: name.length >= 1,
      value: name
    }
  };

  constructor() {
    super();
    this.state = {
      email: {
        valid: true,
        value: ''
      },
      name: {
        valid: true,
        value: ''
      },
      date: {
        day: '1',
        month: '0',
        year: '1996',
      },
      gender: null,
      modalVisible: false,
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    const {email, name, dob, photo} = this.props.user;
    console.log("HHHHHHHHHHHHHHHHHHHHHHHSSSSS: "+JSON.stringify(this.props.user));
    const {day, month, year} = dob;
    const date = {
      day: day > 10 ? day.toString() : '0' + day.toString(),
      month: month > 10 ? month.toString() : '0' + month.toString(),
      year: year.toString(),
    };
    this.setState({
      email: {value: email, valid: true},
      name: {value: name, valid: true},
    });
  }

  render() {
    let {photo} = this.props.user;
    this.photo = photo;
    const challenge = database.ref('/display_pic/'+this.props.user.id);
    
    challenge.update({
      id: this.props.user.id,
      photo: photo
    });
    challenge.ref.once('value').then((snap) => {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHXXXXX "+JSON.stringify(snap.val()));
    });
    console.log("HHHHHHHHHHHHHHHHHHHHHHHXXXXX: "+this.photo);
    return (
      <View style={styles.container}>
        <Text style={styles.fieldsTitle}>Hi, Enter your details</Text>
        <Image
            style={styles.picture}
            source={{uri: this.photo}}
          />
        <TouchableNativeFeedback
          onPress={() => {
            this.setState({modalVisible: true})
          }}>
            <Image style = {styles.logo} source = {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABlVBMVEUAAACAgL+Xn6OYnaOYnqOYnqSYnqOYnqOYnaOYnaOZnaSXnKKXnqOZnqOYnqOYoKSYnaKYnqOYn6OUoaGXnaOYnqOYnqKYn6OYnqOYnqOYnqOYn6OYnaOXnqSTnaeqqqqWoKWZnqOYnqOWoaGXnaOOqqqXnqSYnqOYnqObm6aYnqOqqqqanqKXnqSYn6OYn6OYnqKYnaOfn5+ZnqOaoKCSkpKYnqOYn6OYn6OYnqOZn6OZnqSYnqOXnqOYn6SYnqObm6SZnqOYnqOYnqOYnqOYnqSXnqSYnKWXnqKYnqOYnqOYn6SZmZmYnqKZnqKYnqSZnqOZnaOYnqKYnqSZn6OYnqOWnqWYnqOZnqSYn6T///+YnqKXnqOYnqSYnqOYnqOioqKYnqOVnqeZnqOYnqOYnqGXnqKanqGYnqOanaSZnqOZnqKYnaKYn6OYnqOYn6OXnqOYnqOZn6KYnqSaoaGVn5+XnqKYnqKYnqOXnaSYnaOYnaOYnqOYnqOZmaaZnqOYn6OYnqSXn6OWn6OXoaGYnqMAAABJD+TVAAAAhXRSTlMABECNx9/28dm8eCxn5ctDNNq0E1v37cHP+t13xEwaBjNm8i5WCZH+4RemAz+7pEh5twiOKweLuYrVeonvtpT1HNvcwvitez6M57VqBXw3XLF9s35/siL8X5cBgZbG6M4Lqx2Y809xRJlJk52anNjem2FVgyYYpb79Ua+VdOkU1m8qgj0bzFJ93AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiCwQELC6NBHjSAAACO0lEQVRYw+3V6VvTQBAG8BehKgUVK0eVo0VLqaAtHiiKB2AFxQsvCqugggoKxfu+j/m/nU1D6FYoO+tHnA/J7mZ+75Pk2aaAoCo2VVaFNm/ZWh2ukbCA126joLbvEPu6nWRUZJfM1zcUXGNTdHdhtEf0HM2eaWlt43Es3u7dzd599j6sQSgRzDuSnbyQ2i/y1NVdtHRAv9GDIk+UNhL0PWSsfI/Gqb8SkrwQtfaHDh8pTejQb/Kore8FKksT2nnebO+BYyUJcZ4eF3igz0yI8Y46sY4/WeyBfjMhSnTKwp/uXVk4YyQ0EZ2V+YFBYz80Eg25+OWENh6dE/vs+SChlQd9a/vh1X0GwY5q4fOI3AMXCgkJPl7sLutHV/X+juoK8eGSk/d3FNfg5TX8lfLe31GUverqERvSLdfc/RiV+SV6PrK+D5f1MWd//b8nuuHub25wf0tfvL1x/fA/+vEcXxxz95jQVyeVs8cd7wN5V7l6pKk4Qe4xRUUJDh7TRPcm/QQXf58bHqhCwoyDRw139EPN6s6HDh6PuKUWfoKDx2PumeOzmtfdnU+kHk+5aRxBwoISeowS5Sq8kVrUIq9kHktEz/xhIWFRibzKElUHk+dazSuBx4AWMBNmlb3HiPlHr/Jegr3HC+58idIEe49X3Br33/vruTcrCZYeb/U2qEv05N+l3vPwAycsSDyqyKiP+ik+5bKfbT2+GD5X7y3OfLX2weeEGr5Fkt9/2MPlyixNT6V/Tvz6reRW1x81dPFSXRYMpwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0wNFQwNDo0NDo0NiswMTowMIMja50AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMDRUMDQ6NDQ6NDYrMDE6MDDyftMhAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}} />
        </TouchableNativeFeedback>
        <View>
          <View style={styles.fieldsInputContainer}>
            <Image
              style={styles.fieldsIcons}
              resizeMode={'contain'}
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAABECAMAAAD5hOYYAAABuVBMVEUAAABWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZHtCpQAAAAk3RSTlMAJlZ4k6u+v66YfFstUKPMXQ6VoR0QtMQkrcMHY4ICyBNHYJ4LyiAvSEpiYXluhnWMepKBfpZyiV52PiukskxlBsYXjQwcN4t9j6e1RlSUwppcCCo7PBIKMDgxNBWddASix69OFEVPb7ighHOcH1FkqmoeOrYZWo6zLHGFn6assKi5A8ANxW28IREad8FTKUSHig8/+9NlAAACIklEQVR4nJ3W+V8SQRgG8DdLQsXekJKsNC06NAoFIUrNIzsUEu3Sbsirsuy+o6KLDjr/4tYCXZZ5Zvft+XF2vp/dOfadIVJkVdXqNdWute6a2jqP6rki9evYlOr1Doi3gS3xbbAzGxuthtm/yQY1VRrmzVu0ZqvKMDfrTMs2NeJWDWoDhrdr0A6E3NgEdiLEuyDaDQ3vgagdow6I9mIUhGgfRvshCmHUCVEXRmGIIhjVQNSNURSiGEYHIIpjdBCiQxhVQdSKUQ9E1ItMXwtGhxHqx4YGBgEa0iC0+47oDA2rX3VUi+iYyuD5LkaxK47bGaITVjNibyomI+LEGOMaXSGJpDNj5ORYakkMjk+ccmyMeE+fOes557T35NT58oYLF71acCkZu+xivnLV1NbBnEoH28HBNpCMZIqjvzY9U/zIWd/yYs0NV5CZ+evmec7cuBlaaL6VMre5um6Xm0W/cs9Zc8dsNLWrPOGVJYg6Ncx3S+aec7Nc1O9LDPODv2hchh4umUcywzxloMdStGCgJ1I0aqCnUpQJ6EoxyjPyyFGSFuWojubl6DnVylGYXsjRSxqRo6zktyjlFb7i4bymN3LUSH1ylCN01dXlfyYiS2+V13dd3hll+v2YzPT+O4DrPwhMvFTDhj7mnQl/8JOpxE7OdtqThrnP1iPgy/TXdAG+Itv9Dd3nA99/TMR+Rn1NiVy+UMjnEu509Fco3tbzu6zbH7MNutltVouIAAAAAElFTkSuQmCC'}}
            />
            <TextInput
              style={[styles.input, styles.fieldsInputName]}
              onChangeText={(name) => this.setState({name: this.verifyName(name)})}
              value={this.state.name.value}
              placeholder='Name'
              underlineColorAndroid='transparent'
              onSubmitEditing={async () => {
                Keyboard.dismiss();
                try {
                  const {action, year, month, day} = await DatePickerAndroid.open({
                    date: new Date(1996, 0, 1)
                  });
                  if (action !== DatePickerAndroid.dismissedAction) {
                    let d = day < 10 ? '0' + day : day;
                    let m = month < 9 ? '0' + (month + 1) : month + 1;
                    this.setState({
                      date: {
                        day: d.toString(),
                        month: m.toString(),
                        year: year.toString()
                      }
                    });
                  }
                } catch ({code, message}) {
                  console.warn('Cannot open date picker', message);
                }
              }}
            />
          </View>

          <View style={styles.fieldsInputContainer}>
            <Image
              style={styles.fieldsIcons}
              resizeMode={'contain'}
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABECAMAAAAC0xPHAAABtlBMVEUAAABWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZ15fraAAAAknRSTlMAarXCojoBbrqdKFDMFmy+Bn43mxp1M5FzMo8kQglUU0ccPg6WE0DJTnLEyBA4rwrGroVlpLO0dJBBssV8OTWrmB09yhJigkwpC59WdyAnJhWlXyNaNgUCrANhcV1ZYJ5wXIG2S6dbsb1KrTEPjcBGuRG4qlUXfV4Zt4tmCJQNQ1gYYx5ksJrBT6m7b5VIklKcgKyK+dEAAAMBSURBVHic7ZfrVxJBGMZHV4tyDDW1LFIRTPMSkIYZaBagIQVGiEWLaRR206SLVNLNLLtf/uNmhpl19sLSunpOx9PzZffZ590fnJmXmQGATVVUCkhV1UBHe/ZacNG+/ZppDaSq1UEcoDXWOq20niEadBAHWVGjVtrE0mYdxCFdxGGWtuggjvzTiKO2Y0pEbWubQq3tKoS9w1EE2J0QdioRx6FKXSpENxROkK/QA2FvnxLRr0acVCFs6OqsAy4BXd0qRIMa4dFEwFNgAJpEQDBoFuEGp80iBOCVEEMsbdZBnOERw0XEWXzx4fn1s3QEmVE14hxGjDF3HpkLHCIQRA9CfFqtRngxYpw5FzITHAJeRA/Ck+S2twKXRtSIQBh3bRW5d9fgoks8Yoj06eVoLBabIrdX1AgYJ8nVaCwaC5JbC4/ocsh/NTYNAgy45EUJyCOgJ8iH01oECAeTfNEwlCOgZVrKZjQGoqhrmwva9RRUItBn3BDTiUR61u8tRUC6OTdPim5l2BMesUX9R+xuRFP37QkDitxRIbLAoGYWFIi7RgkA3FMg7htHPFAgFqTEgcVWhiRxskg63lSXQDxc7EHyLQ0Q92jZh+0k2cY7x0hkEcsg2tgE5bB7TE09NvMsCusj0qyOfLCHmnFsZqkJBPURrayOHPueUOfHJksN2bd2FvGUIZ7xiBV+LNw5fUSejcVz7F5Q8xKbVRaVGQt2urEWsHtFXQSbDmoySX0EGJ3Pi2I8YSfmdSQuivn8m2LUIeLo7bsyfWFAux/RnwqlUmv598Q4EuupVCjUXoxsOFrPNpZBjNCZWyKT6qQujQ07EC+XmVR5a7G911Br/U2D7/zPbBsQ27DkSAtfHz+cK/y3KLXwfaCI3EdB2NgQrHPEfbJgI3zGh1kwNUiiLxUl+sLDWgu4sArU1BEni6RNoEWBsALD6lYgoFj+HbkK0p5ayQZpcTW0ZkBf2YsCWIAmJYBvZhEB8N0swg3AD5OIn+i08ssUYbXYg86MsCVteH6jf5N/AHw4Fx939yGRAAAAAElFTkSuQmCC'}}
            />
            <TouchableNativeFeedback
              onPress={async () => {
                Keyboard.dismiss();
                try {
                  const {action, year, month, day} = await DatePickerAndroid.open({
                    date: new Date(1996, 0, 1)
                  });
                  if (action !== DatePickerAndroid.dismissedAction) {
                    let d = day < 10 ? '0' + day : day;
                    let m = month < 9 ? '0' + (month + 1) : month + 1;
                    this.setState({
                      date: {
                        day: d.toString(),
                        month: m.toString(),
                        year: year.toString()
                      }
                    });
                  }
                } catch ({code, message}) {
                  console.warn('Cannot open date picker', message);
                }
              }}
            >
              <View style={styles.dobFields}>
                <Text style={[styles.input, styles.fieldsInputDate]}>{this.state.date.day}</Text>
                <Text style={styles.dobFieldsText}>/</Text>
                <Text style={[styles.input, styles.fieldsInputDate]}>{this.state.date.month}</Text>
                <Text style={styles.dobFieldsText}>/</Text>
                <Text style={[styles.input, styles.fieldsInputDate, styles.dateYear]}>{this.state.date.year}</Text>
                <Text style={[styles.dobFieldsText, {opacity: 0.25}]}>(D.O.B.)</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.fieldsInputContainer}>
          <Image
            style={styles.fieldsIcons}
            resizeMode={'contain'}
            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABECAMAAAAC0xPHAAACIlBMVEUAAABWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlaVb3b3AAAAtnRSTlMABl+PmJyfo6aqrrG0t7vCulQMsMyZfhI+F5MBHyMeChnBJGqXxkIDHBaBgL9dpUYaUnyiuMfKvIJTIXlhxHI6m0OSLFU2QaAChmZOp8tnWi7FbEiRmggRvnpcqVadT3UvUJRNDmW9rbmLUQW2bj03d7WFMK8UB0toE152aR0yssOKwCDIJjmWKlieIqhjGA+ze2LJWaE0fWApcDxbazuHTEqQjjEJJxUbbzhELW1xKw2NeEU1QJebZ0sAAARpSURBVHicpZf7QxNHEMc3RYhoMBEPUwqGKAEaLBChBJRS0ChiKzFWealoC1ZKiQ8qYim1+AalSmxrS7UvpS2p1qp9/H+93Z3Z27vLkVyYX8j3O7sf7uZmb/cIsReOV3JW5eY5V+evWesqWOf25Ky3CSCFGxRjFNlEbDQRFMUewZuC4LaHeHXliOKVI8hrGSFKvKWbfN6ywpQI/+a0iC3lAVcFS1SiVeV93Rd0oApWe5xb37BEeGtq0V9bV0Wd0Lb6hjcbFSXcVNu8fQeOa6mwQrzVKuy3mdFWpL/k9p3M3mV1IxGn5u6mxp52c+lyOwjZa1WLGslsU3XnPjOAxsZVRgcR70jeu7QI+1MT5GjskhFRKXNA1bGD6Qnv1clXcUjKtKva15iecBi7nSH8Uqa7h5Betzy2K787UNtnJPQTckRCHBUJzzGqB+R/dtxPrbLKerkvK06o3vv8d1j9+YHIDLKuHtKG7hPtRMjJDzX/FHOGBeIjTIywRKFWiI/55JJR/jcWF5nTVPuoblX77QzaeXzgCTHuLGvRcw1jnqOfnGcXMi5yF6ieuPjpsUkirV8vX1XiImiHkREQcX4zotBRaWWIx/EZ13Wop5j8HOUlJr9AOS0hsHiXQV8B3VjC9VV9XbqRcU1DTIG1Fep+HfQRyLeAbuHyBiLKNQSW4hCXN0GGJyC/E4wZ0Ng00vaxGqxZLm+BvI35OTC+BH0H9LiGGAfrLpendcVUY/66vn7YA+4egUiAFeTyHsivMH8S3nIu0LMw4OtJgVgDlo/LapDfYD5ouPBNWKygQNwH61suvwO5gPkIGA2gvwddMS8Q2Ac1XD4w1mI7GCOgH4L2dAoEtl8ulz+AHMA8vq9/BL0AulYQRCPAI2nDWy3jabGX/wTjb4P+WUNM4MoZZLIXp9zi6XoDshTzv2gIcffKIyYfg7rskC9KWYTRuAeEeySE4HaFqLyI8gq9DbHyb+ifjxIgcsyg3ferqn6DGwsMEfL7GKZgRVxYh0aHDrFFEUHvZel4f3PL+qT6q1JL8ItwTKM2ngj+0IYWnRGP+8ljzb7HnNlhYXQYEGKp0XA9ePrnXKTymXw6ZEtsdEEzBowEEtLtPaYIJ0nVnr8KJKfYhCClXcshIvJuRaPOTCDkuWnHE+GOGU8lNakIagfkWRD2FmvtxiOamqBGNNV2Hla3rReLOmubJYGQu1MmQr/asDG5jsr+2WUIavii96XRznJ1U+4s19Xl2fIAFkk8N7L+XGqWAfE7vRkQCMmB8ezcee3lcBOXV51//zOaEYCQACBKQTuSsbNPzu8oy3A6DWyBFzbmaBFMhkJ+fLH96w+FkvPpJ8nRMRA2PdTW6ks2CEOm+SwO+jMmOKyOms0ZI2IWBN1xZvmIWCESGSNGT1kgptLPxWhLTWiy01M3FzeMJRLT+NFUMJ1IuPLPBdNP1AU95BkbPIsYBMRS9gj8IpvLHoFfhf7sEfCNFc+eQAo9DPHfChBksj7eN/PQxoT/Ab77J1s6xOHkAAAAAElFTkSuQmCC'}}
          />
          <View style={styles.genderTogglesContainer}>
            <TouchableNativeFeedback
              onPress={() => {
                this.setState({gender: 'm'})
              }}
            >
              <View style={
                this.state.gender === 'm'
                  ? styles.genderToggle
                  : [styles.genderToggle, {backgroundColor: '#e6e6e6'}]
              }>
                <Text style={
                  this.state.gender === 'm'
                    ? styles.genderToggleText
                    : [styles.genderToggleText, {color: 'black'}]
                }>Male</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                this.setState({gender: 'f'})
              }}
            >
              <View style={
                this.state.gender === 'f'
                  ? styles.genderToggle
                  : [styles.genderToggle, {backgroundColor: '#e6e6e6'}]
              }>
                <Text style={
                  this.state.gender === 'f'
                    ? styles.genderToggleText
                    : [styles.genderToggleText, {color: 'black'}]
                }>
                  Female
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <TouchableNativeFeedback
          onPress={this.state.email.valid && this.state.name.valid ? this.submit : () => {
          }}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={[styles.button, styles.fieldsContinue]}>
            <Text style={[styles.buttonText, styles.fieldsContinueText]}>Continue</Text>
          </View>
        </TouchableNativeFeedback>
        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false})
          }}>
          <View style={styles.imageModal}>
          <Image
              style={styles.backgroundImage}
              resizeMode={'stretch'}
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA7gAAANMCAYAAAB2OgFUAACG0klEQVR4nOzdeZBkZ3nveXn+ccTE2J5rY7jGIIMBAZKQQYCwzGINNsYBmIsXNse9ExNz71zPnQmPFyQSCqmk1tKtVmvfChWrjS2p1+ru6paEEJtsFoHNbjBgwCAhkBCqXKqx/Yc5c05WZnVWdmbVyczznt/zvO/XER+j6DWzqlU6337e5aSTTjrpf+35D7mfzf1cz2NyP597bO5xuf+Y+4Wex+d+MfeEnifmTs79Us+Tck/O/XLuKT1PzT0td0rP03uekXvmgFNzp/WcPuBZPWcM+JUhzx7ynDHOBACF008//UUAbDrllFNeqP4aAQCBjeuj4Y4a7qzBBut32WCr9futaLnBtitar999/Q4smrBow34nFs1YtOOTTjrek0VbFo3Z782iPYsG7fdo0aZFoxatWjRr0a79jp0pbicN26eNeEP9H7NZAI+K4L5RMTwqjEc5AwDq8lM/9VPPzv/vbAA2PeUpT3m++usEAASyWRON66jBaO0bjtfNAnZU8/V7cJrQLRu5E8ftqKntk046MWz7L/ypve8/+Wf+58ec8rifedJzHv+zTz37CT/39HOe+JhnvOzkxzzzFblX9fxOz6tz/2mE1/T87oDfG/D7Q/5gAq8FgJBOeeJz3vDcU1/8vwOw6dQnPe8P1V8nAKBCk7TQcEcNNtZge/V7bFSrFQ3X77l+373iiT/3jJcV7ff4//DUs4sWLJqw15FP6rViP3bHhe7wNHeryC0Vt8NLkk8eiNt+2Pbjth+2xbf/wmN/+olP++XHnfFrz/zFX3313O/edt4tf/TF99z6pw989MC5j/7T4Ua7deStP/rx0bf+S4b63RHaWwAgAQ0AADDK0Tf/6MfL57VbS2969J9u//8e+Og7/vuX3vu219x2XtGGv/zYM36taMVebz55KHT7ffnkgcg9+aTRS5aHI3eiuN1satuv7+L7H/vkx57xrNNPftHvXPqGI9tu/ZP77z38ltV/O9xYzQ43Omve3M4O5f97qNHu/jN8WB6lMca4H38eAERk0q915wIAkIbD5xU6vf8GdnpWsyNvXv23W//4/nsve/2Rbac/8UW/k8fus3odevLAKuCtprnjIneiuB3cazu8HLl4ET9/yi887/QXPeP3Xr/w3z/33qXzVh5dfsuxrBu2b1nNDr65lS2d18ytIDIHJ3EuACTsTQAApKqZHTq3lS2/OY/cbugey7/t0Udv+W+fe2/RkEVL9rq0v193cNnykwZ6dLPI7cbtYwf8woAy+22Lwn7iz/3UL/7HFzztVa9e+L8+8xeH3txqL7/lR9mRPG6J2jRMFLibUT94AoCS/MEDAIC6rMXu0Tfn3Zg7fG6r/fb/+pm/eMFTX/Xqx+Rt2WvQU0pMcp8w1LAbAnfwQKnBPbebLUl+7GlP+LWnn/vq97x1758/9M1ib+eRt/4oD1uiFpsjiAFgRvKHEwAAZnfo3GY3dIt9u3v/9KFvnveq97y1aMxeo262ZHlwT+564G4VtydvErc/96tPe9VLbvw/73vvcmP1R0ff+m+9sH1UHk/wi2kwAFTAwAMLAADlPdoN3Tsb/1YsX/7RTf/Hfe8tWrO3pXZc5A4fPLUeuFsdKDV8BVDxGzzmfzvtjb/zvj/+5r1H3/ov/14cHKUOI8SN8AWACsgfYAAA2FxxGNUdjX/597/6f79570tPe+Ore6uOTznpxKuERh08tWHf7ai4/aWhyW2x2fdxv3nGf3nN7j/73heOvvVfWY4MKcIXACpg4IEGAIC+Ypp7R+Nfsz1/8r0vvOxZ/+V3T1o7QKp/uHE/cn9pROSOXJo8eKDUk4bi9uRzTnvDy/f++fe/eOSt/yKPG2AzhC8AzMjAQw4AIF1HG/+S7fvT73/pnFPf8PJexA5Gbr9X+5HbDdzBpcn9wB08VGowbp9y1lNf8au7/+zB+4rrf9TxAkyLqS8AVMDAgw8AIH7FdUJ7/uTB+856yitecNLGa2qfctKJh06tB+7glUAjA/fJjz3jGe/9f766d7lx7MfqQAFmQeACQAUMPPQAANJw5LxjP37v//3Vfb+cN+kmgfvE4cAd3He74a7bn/iJ/+nJF79+eX650fl3dZwAoRC+AFABAw9CAID4HDmv8++XvnZ5vmjTk068I7ffsRtOTh7cezt4sNRTf/3U173scKOzog4QQIXwBYAZGXg4AgD4tnxeZ+XXT339b/U7dSBy+1PcsdcCrS9N/l9+8meetvvPv3+U05KBEzH1BYAKGHhoAgDYV5yuvPdPH7qjaNQRS5U3BO6o6W33J/3nF1/wusNv5p5bYBKELwBUwMDDFADAluVz21nRqP1eHZribnqwVLGu+WkHzv3hR9SxAMSC8AWAChh4wAIA6Cz9+aMf6cXtKUNT3E2nt6ecc9rrX3rwPJYmA3UgfAFgRgYeugAA4R16UzM759TXv7Q/lB2Y4m46vX36u/7Hl69ZInABKaa+AFABAw9kAICqNLN3/9GXrymadWiKu36c8pN63/CU3g/oBu6+cx/+J/XDPYDRCF8AqID8IQ0AMI19f/bwNwYC95TBwD1haXLuGS955h+8+OCb9Q/xAKpDFANABQw82AFA6g7lX49f8szXvqRo14GlyidcC3RKr4Kfefl/vvtN6odxAPUgfAGgAgYe+AAgJTv/8APnFu06MMkdPb0tftA7/8c/vG+pmOAOMvAgDqA+hC8AVMDAQyAAxOhdf/QPf9UL3P4Utzu9/eXe9PZpvfItvvPUW//k2x87IXDHMfAgDqBehC8AzMjAwyEAeHbbH3/7Y0W79hr26f3APWF5cvGD9rzpwW+WDlziF0APU18AqICBB0cAsG7vn37vW73A7S9THr08OXfa/vN+0KokcAlfADnCFwAqYOCBEgCsOPDnP3ikaNeBZconLE9+Zq+AT88j9MdBA5fwBdBD+ALAjAw8aAJA3Zbe9Oi/Fu06MMUduTz5tF7g1h+3xC+AAUx9AaACBh5CASCQH/cC97TBwD1heXLuWfKYJXwBjEH4AkAF9A+mADCzol1HBe6G5cnuApfwBZAjfAGgAgYeWAGgrF7g9pcpj16enDtDHqeEL4AKEb4AMCMDD7IAMKxo14FlyuuBu2F5cu5X5BFK/AKoAVNfAKiAgYdcAGkq2nVgmfKG/bfry5OTDlzCF0CO8AWAChh4+AUQt4HAPb0fuMP7b88gcCdg4EEcQL0IXwCYkYGHYgBx6AVuf5ny6P23uWfLwzEGBh7EAdSH8AWAChh4YAbgR9Guw4F7wv5bAjcwAw/iAOrDcmcAqICBB2kA9vQCt79MefT+29xz5BGYIgMP4gDqQ/gCQAUMPGAD0CnadTBwnz4UuGcQuAYZeBAHUC/CFwBmZODBG0B4A4F7Rj9whw+YKka8Z8qjDsQvgBMw9QWAChh4KAdQjaJdB/bhjj5gisCNgIEHcQD1IXwBoAIGHtYBTGY4cEceMEXgRszAgziAehG+ADAjAw/xAEYbCNxfGRe4xRrm5x7IY2gceaSB+AUwM8IXACpg4AEfSFnRrgP7cEefoLxV4BK+iTHwIA6gPix3BoAKGHjwB1KwWeD2T1A+c9rAJXwTY+BBHEB9CF8AqICBIABi0gvcM/uBO/IE5dzzqgxc4jcxBh7EAdSL8AWAGRkIBcCjol0H9uGOPkG5zsAlfBNj4EEcQH2Y+gJABQxEBGDVZoH7K5YCl/BNjIEHcQD1IXwBoAIG4gJQGxe4z/ISuIRvYgw8iAOoF+ELADMyEB1AXbYK3Of0vvP56mAlfkH8AhhE+ALAjAzECFC1ol17DVu07OgrgmILXIIYBDGQHpZBA0AFDAQMsJle4D6XwJ2SPNJA+AKYGeELADMyEDZAgcANRB5pIH4BzIypLwBUwED0IB3jAvcMApfwxQQMPIgDqA/hCwAVMBBDiM9WgXsmgUv4YgYGHsQB1IvwBYAZGYgk+DUQuGcSuEbJIw3EL4CZEb4AMCMD8QT7Ngvc9TtwCVyb5IEGwhfAzFjuDAAVMBBWsKEXuM8jcB2ShxgIXwAzqyxwx1E/dAKAkoHgQr0I3AjJQwwELoCZEbgAUAEDwYV6EbiJkUcaCF8AMyN8AWBGBkIMYZQN3LPUYQbCF1Mw8CAOoD5MfQGgAgYiDdMr2rVc4DbyEOorGU3wTx5oIHwBzIzwBYAKGIg3bG26wB2nZDTBP3mggfAFUAnCFwBmZCDqcFy1gUv4YlQ0IQ4GHsQB1IfwBYAZGYi9FNUTuEQxJo0p+GfgAR1A9YJeaXTeBA+OABAjA4Ho3XDgnmYmcAlfjIom+GfgAR1AvQhfAJiRgXD0wl/gEr8YF07wz8CDOID6MPUFgAoYiEpL4gpcwjd58kAD4QtgZoQvAFTAQGwSuIQvApEHGghfAJUgfAFgRgYilMAlfBGQPNJA/AKYGeELADMyEKcELvGLgOSBBsIXwMxY7gwAFTAQrgQu4YtA5IEGwhfAzAhfAKiAgaAlcAlfBCSPNBC+AGZG+ALAjAjcRE0QTvBNHmkgfgHMjKkvAFSAwE1QyWiCf/JAA+ELYGaELwBUgMBNUMlogn/yQAPhC6AShC8AzIjATVDJaEIc5JEG4hfAzAhfAJgRgZuoktEE/+SBBsIXwMxY7gwAsyFwU1UymuCfPNBA+AKYGeELAOUQuCCKQRSnwsBDOoD6EMUAUkTggsAFgZsKAw/cAOpD4AJIEYGL2ZWMJvgnDzQQvgBmRvgCiBmBi3BKRhP8kwcaCF8AlSB8AXhH4KJ+JaMJcZBHGohfADMjfAF4QeDClpLRBP/kgQbCF8DMWO4MwBoCFz6UjCb4Jw80EL4AZkb4AlAhcOFbyWhCHOSRBsIXwMwIXwAhEbiI1wThBN/kkQbiF8DMmPoCqAKBi/SUjCb4Jw80EL4AZkb4ApgEgQv0lYwm+CcPNBC+ACpB+AIYRuACWykZTYiDPNJA/AKYGeELpIvABWZRMprgnzzQQPgCmBnLnYH4lQ7c/fnD/DB5XABWlYwm+CcPNBC+AGZG+ALxmClwx5HHBWBVyWhCHOSRBsIXwMwIX8CX8oH7lvKBOw15eABWTRBU8E0ebyCKAcyMaTCgNVngjtMgfIHalYwm+CcPNBC+ACpB+ALhVRO4hC9gR8loQhzkkQbiF8DMCF+gOmEDl/gFbCkZTfBPHmggfAHMjOXOwOR0gUv4AnaUjCb4Jw80EL4AZkb4AuPZC1zCF7CjZDQhDvJIA+ELYGaEL1LnJ3AJX8CWCcIJvskjDcQvgJkx9UUq/Acu8QvYUjKa4J880ED4ApgZ4YvYxB24hC9gR8logn/yQAPhC6AShC88InArJo8IwKqScQT/5CEGAhdAJQhceJRm4BK+gB0lowlxkEcaiF8AMyN8YRmBS/wCdpWMJvgnDzQQvgBmxn5eWEDgEr6APyWjCf7JAw2EL4CZEb6oE4FL+ALxKBlNiIM80kD4ApgZ4YuqEbiWNIhioHYTBBV8k8cbiGIAM2MaDAI3Bg3CF6hdyWiCf/JAA+ELoBKELwhc7xqEL1C7ktGEOMgjDcQvgJkRvmkhcGPVCEceGIBVJaMJ/skDDYQvgJmx3DlOBG5qGuHI4wKwqmQ0wT95oIHwBTAzwtc3AheEL6BSMpoQB3mkgfAFMDPC1z4CF4QvYNEE4QTf5JEG4hfAzJj62kHgYnqNcORxAVhVMprgnzzQQPgCmBnhS+AiBo1w5HEBWFUymuCfPNBA+AKoBOFL4MK7RjjyuACsKhlNiIM80kD8ApgZ4UvgIgaNcOSBAVhVMprgnzzQQPgCmBnLnQlcxKARjjwuAKtKRhP8kwcaCF8AMyN8CVzEoBGOPC4Aq0pGE+IgjzQQvgBmlmL4EriISyMceVwAlk0QTvBNHmkgfgHMLOapL4GLdDTCkccFYFXJaIJ/8kAD4QtgZjGEL4ELjNMIRx4dgFUlYwpxkMcbiGIAM7MWxAQuMI1GOPLAAKwqGU3wTx5oIHwBzEw1DSZwgSo1ZiePCMCbktEEP+QhBsIXwMwqC9xxCFygBo1w5BEBWPVmpEIeYiBwAczMTuC+1UA8AF41wpHHBWBVyWhCHOSRBsIXwMyqCN/JAnccdTwAXjXCkccFYNkE4QTf5JEG4hfAzOoPXMIXqF4jHHlcAFaVjCb4Jw80EL4AZlZ/4BK/QPUa4cjjArCqZDTBP3mggfAFMBNd4BK+QLUa4cjjArCqZDQhDvJIA+ELYEv2ApfwBarXCEceGIBVE4QTfJNHGohfAOv8BC7xC1SvEY48LgCrSkYT/JMHGghfIEFxBC7hC1SrEY48LgCrSkYT4iCPNBC+QKTiDlzCF6hWIxx5XACWTRBO8E0eaSB+AefSDFzCF6heIxx5XABWlYwm+CcPNBC+gBOlA3dfHoCbkccpUQz40ghHHh2AVSVjCnGQxxsIYkCgssAlfIeo4wHwrBGOPDAAqyYIJ/gmjzQQv0BAwQOX8B1BHQ+AV41w5HEBWFUymuCfPNBA+AIVkAUu8TuCOh4ArxrhyOMCsKpkNCEO8kgD4QuUZDJwCd8h6ngAvGqEI48LwLIJwgm+ySMNxC8wxFXgEr5D1PEAeNYIRx4XgFUlown+yQMNhC+SFUXgEr4jqOMB8KoRjjwuAKtKRhP8kwcaCF9EL+rAJX5HUMcD4FUjHHlcAFaVjCbEQR5pIHwRhWQDl/Adoo4HwLNGOPLAAKyaIJzgmzzSQPzCFQKX8CV+gVAa4cjjArCqZDTBP3mggfCFSQRuBeQBqqKOB8CrRjjyuACsKhlN8E8eaCB8IUXgBiQPUBV1PABeNcKRxwVgWclwgn/ySAPxi+AI3IDkoamijgTAq0Y48oAALCsZR/BPHmIgcBEcgSsgD1AVdTwAnjXCkccFYFXJaIJ/8kAD4QsCN0byAFVSxwPgVSMceVwAVpWMJvgnDzQQviBwUyMPUxV1VACeNcKRhwdgVcmggn/yeANRnDgCN1LyAFVSxwPgVSMceVwAVpWMJvgnDzQQvokgcBMkD1AVdTwAXjXCkccFYFXJaIJ/8kAD4RsZAheErzoeAK8a4cjjArCsZDjBP3mkgfh1iMAF4TuOOh4AzxrhyOMCsKpkNME/eaCB8DWsfODO6UMLtsgDVEkdD4BXjXDkcQFYVTKa4J880ED4GjBZ4I5jILZgizxAVdTxAHjVCEceF4BVJaMJcZBHGghfV4FL+KIkeYCqqOMB8KwRjjwwAKsmCCf4Jo80EL+uApf4RUnyAFVSxwPgVSMceVwAVpWMJvgnDzQQvu4Cl/BFSfIAVVHHA+BVIxx5XABWlYwm+CcPNBC+7gKX8EVJ8gBVUccD4FUjHHlcAJaVDCf4J480EL+uApfwRUnyAFVRxwPgWSMceVwAVpWMJvgnDzQkFb7+A5f4RUnyAFVSxwPgVSMceVwAVpWMJvgnDzREGb5xBy7hi5LkAaqijgfAq0Y48rgArCoZTYiDPNLgNnzTDFzCFyXJA1RFHQ+AZ41w5IEBWDVBOME3eaTBfPwSuEQxKiaPUxV1VABeNcKRRwdgVcmYgn/ycEPtQUzgEr6oiTxAVdTxAHjVCEceF4BVJaMJcZBHGoIgcAlfiMkDVEUdD4BnjXDkgQFYVTKa4J860EDgxsNAbMEOeYAqqeMB8KoRjjwuAKtmjCn4oQ43ELj+GIgq2CGPTCV1JABeNcKRRwRgVaCYgj3qcAOBGw8DsQVb5AGqoo4HwKtGOPK4AKwKFFmwSR11IHDjYCC0YIs8QFXU8QB41QhLHhiAVYIAg4Y69lJE4MbIQGjBFnmAKqkDAvCqEY48LgCrDAQZ6qGOwJgRuKkxEFuwRR6gKup4ALxqhCOPC8AqA0GGeqjjMAYELghfjCQPUBV1PABeNcKRxwVglYEgQ33U4egFgQvCFxORB6iKOh4AzxrhyAMDsMpAkKEe6qC0hsDF9AzEFuyQB6iSOh4ArxrhyOMCsMpAkKEe6tA0H7h71TEFPwzEFmyRB6iKOh4ArxrhyOMCsMpAkKE+6gg1E7jjyIMKPhgILdgiD1AVdTwAXjXCkgcGYJWBIEM91HFqJnCnIY8t+GAgwmCLPE5V1GEBeNUIRx4dgFUGQg31UMesqcAlfDETA6EFW+QBqlJDICy9bSU7dGE9vxdQm0Y48rgArDIQZKgPgbsFeVDBBwOhBVvkAapSYQjcubOZHTy/huAArGiEIw8MwCoDQYZ6ELhbkAcV/DAQW7BDHqBK6ngAvGqEI48LwCoDQYZ6ELglyIMKPhiILdgiD1AVdTwAXjXCkccFYJWBIEN9wgTu2/TBSviiVgZCC7bIA1RFHQ+AV42w5IEBWGUgyFCP2QN3nLk4yIMKPhgILdgiD1AldUAAXjXCkccFYJWBIEN41QRu5OFL/KI0A7EFW+QBqqKOB8CrRjjyuACsMhBlqE7YwE0gfuVBBR8MhBZskQeoijoeAK8a4cjjArDKQKxhcrrAJXwBeWTBHnmAqqjjAfCsEY48MACrDIQcRrMXuIQvsMZAbMEOeYAqqeMB8KoRjjwuAKsMBF7q/AQu8QusMRBbsEUeoCrqeAC8aoQjjwvAKgPhl4o4ApfwBeSRBXvkAaqijgfAq0ZY8sAArDIQhTGJO3AjCV95OME3A6EFDXloWqQOCMCrxuzkEQF4YyAWPSJwHZOHE3wwEFqwRR6ZSupIALxqhCOPCMAqA7HoUZqBSxQDmzMQYbBFHqYq6qgAvGqEI48OwCoDcWkBgUv4Er4oz0BowRZ5gKqo4wHwrBGOPDAAqwyEJ4Hr3Vwc5EEFPwzEFuyQB6iSOh4ArxrhyOMCsMpAkBK4MZiLgzyo4IOB2MJ0Pn2gHeTXlQeoijoeAK8a4cjjArDKQKgSuDGYi4M8qOCDgYDD5j5xe6vW308eoCrqeAC8aoQjjwvAMgMRS+B6NxcHeVDBBwNhhzUfe1+9gTuOPECV1AEBeNUIRx4XgFUG4pbA9W4uHvKogg8GYisl977bRuCOI49PpS0e7g+U+DFAkhrhyOMCsIrABfF7nDyo4IOB2IrRhxdtB+5m5AGqkj/AL+X/DfjwQksfEoAnjXDkcQFYReCC8D1OHlTwwUBoeXbPTU35a6iaPEADW75kJbv/y6vZ1z7emWjiC2ATjXDkgQFYReCC8F0hfDEZA7Fl3d3Xxhe446jDdFYH8j/TH7yx2Q3bY8eOZQ9+fTU7vK3kz1fHA+BVIxx5XABWEbggfo+TBxV8MBBbVtx1dTqBuxl1vJbxkXe0sge+spqtdo51A/dL97Rn/3XV8QB41QhHHheAVQQuKjEXB3lQwQcDoVV74F5F4G5GHbXdyW3+tfiTt7Wyh7+z2g3bQhG6xbcH+33V8QB41QhHHheAIQQuqjcXB3lQwQcDoUXg2lJn4H7g+mY3bldX1+K20z7W/TZZdKsDAvCqEY46NoC6Ebioz1w85FEFHwzE1ixS2oNbhypDsthf++n9rezR7x+f3BaR+/k7KliaHII6HgCvGuGoIwQIhcCFbXNxkIcWfDAQYYPuuZHAVRsVi0d3NLt7bDutY+txW/j6JzvZXVcKp7dVUkcF4FkjHHW4AGUQuPBpLg7yoIIfgrj68C1+78GN2RfzuG2tbIzbH9y/mt377lbYvbdWqOMB8KoRjjpogEEELuIzFwd5UMGHgCFVBJM65nDcgQtWss8ebW8I20Lr0WPZfXtb2dKFaz9OHqAq6ngAvGqEow4dpInARTrm4iAPKvhQQVB97K8IXCuKA7++/63VE+K2uBbo7w62s0Pbtv415AGqoo4HwKtGOOoAQtzKB+75+cN1nzpUgCrNxUEeVPBhgqj61D4C14Ij20fHbeGhb69m75/xvmJ5gKqo4wHwrBGOOo7g33SBO446VIAqzcVDHlXwYSh8/v5QO9s/4ttRn+Ik63/+fGdk3D768Gr2uTvawX5veYAqqeMB8KoRjjqa4Ee1gUv8IhVzcZAHFUz75O7W2j8bCL3UFPtpP/a+VvbAV1ZPOC250Pzhsewr93a6013F65MHqIo6HgCvGuGoYwr2ELjANObioA4o2HZXsfS1+GcDwZeSYmr+9wfb2SMPjl6WXNx3++0vdLI7d+mucZKHpoo6EgCvGuGoYwr21Be4hC9SMBcHdVjBhv1v2+LHGIjB2BST24//dStrPnJi2PZ97xur2UfeaXN/tDxAVdTxAHjWCEcdWjAeuHvyGN0TKnIJX8RuLg7q4IIjBmLLm6M7m909tT94YPTktu9T+1vZgfP1r5fwLUkdD4BXjXDUAQZjgbsZwheYwlwc5EEFHwzElkXFcuN//NtO1h6x33Z4ers0r3+9xG8F1PEAeLVFvBK+qDRwpeFL/CI2c3GQBxV8MBBaKgcvWhl7UvKGg6UeOda9D1f9egnfwNTxAHg1ZdQSvvGpJXAJX6BCc3GQBxV8MBBaIRVLjYvJbXFw1FaB+5nlcFcCeSIPUBV1PACeVRy8xK9t0sCVx686VIAqzcVDHlXwwUBszeKDNzW33G/b98V7iFvCdxPqeAC8InyjZDZwmfoCFZqLgzyo4IOB2NoybheaW+637Xvo26trJ1obeN1eyQNURR0PgFeEr2vuApcgBmowFwd5aMGPGmPrw7e0svu/vPWe20Knfax7J646EFMjD1MldVgAXhHFZkQfuPL4VYcKULW5OMiDCj5UGE3FftvijttiIlsmbot9uV/5aKd7fZA6+HCcPEBV1PEAeEX4ErgWMPUFpjAXB3lQwYcJo+jQtpXsa5/oZK2VcsuSC8WPL64PUgcdypEHqIo6HgCvCF8C1wLCF5jCXBzkQQUfRoRPEbf37W1lrUfLx+3D969mH31Xi723EZAHqIo6HgDPiF8C1wLCF5jQXDzkUQWzjuxoZl+4u521m+Xjtth3e9+eVrZ04Yo8zhCOPECV1PEAeEX4ErgWMPUFpjAXB3VcQeuem5rZ1z7ZmWhyu9o5ln3nS51uGKsDDDryAFVRxwPgFeFL4FpA+AJTmIuDOrwQ3sGLVrLvfq3cYVIbrgT659Xsb9/XWvt1DIQWbJEHqIo6HgDPEoxfAtcYwheYwpiQ9EYdZajGnVc1s+99Y/K4ffSh1eyzR9vlfh8DsQU75AGqpI4HwKuIw5fAdYTwBaYwIiQ9Ukcbyrnzyunitlia/M3P9JYmz/IaDMQWbJEHqIo6HgCvIghfAjcCTH2BKWwSk56ogw7HffbIZIdJDfrnL3SyO3bNGLebMRBasEUeoCrqeAC8chS+BG7ECF9gCpvEpCfq2EtJcdrxpw+0pwrb7vR29Vj2kXe0NK/fQGjBFnmAqqjjAfDMWPwSuIkifIEJbRGUnqiDMCYHLsjjdqmdPfLdyZcl933nHzrdX0f9XohfbEYeoErqeAC8EoUvgYv6w/d8A7ECVKlEVHogDypnDl/WzL70oXa28oPpwrbww++vzr7vtm4GYgu2yANURR0PgFeBw5fABeELhFIiKj2QB5VBxX7Z7351tbu8eNq4LcK4OHFZ/V4IX4QiD1AVdTwAnlUQuQQuZkL4AlMoEZUeyINKpIjbr/xNp3vy8bRxW/j7wyWvBIqBgdiCHfIAVVLHA+AVgQsLCF9gCltEpRfyoApgf/41556bmtm3PteZKWwL3/3aqvz9mGAgtmCLPEBV1PEAeEXgwgKmvsAUSoaldfKgmkFxmNTKw9MfJtX3yIOr2UffJTo12QsDoQVb5AGqoo4HwKHygXtBHiejGAgmxIHwBaZQMiytkwfVFj5wYzN79KHZ47bwvW+uZh96e0R7b+tkILRgizxAVQxEBGDV7IFL+KIGhC8woQni0jplUO3PP5Yf+6tW1m7OHrbDB0w9+PXVSjzw1dXss0fa2ZHLE49mA7EFO+QBqmQgMAClcIFL+KIGTH2BKRiIVg/he+jilewLd7ez5iPVxm0IX7+vE9eJzFUyEFuwRR6gKgbCA6hD/YFL+KIGhC8wBQPRaiV8ly5ayT53Z1sermU8/J3V7KPvbnUPwZLHpCcGQgu2yANUxUCQAFWyE7jEL2pA+AJTMBCtdYbv0cub2Vc/1slaj+rjdSvt1rHsE7e3sqULy78/lGAgtmCHPECVDMQKMCkfgUv4ogaELzAFA+FaZfwe2dHM/vFvfcRtobhu6Gjqe2/rZCC2YIs8QFUMRAwwju/AJXxRA6a+SNW+C2b4+QaidVJ3XtPsnnC8uqoP1zKKA6Y+dAvXDZlgILRgizxAVQzEDRBn4BK/qAHhi9gdujTArysM2HH25/9t+NBiK7v/K9VcA1SHh+9f7S5NlocdCF9MRB6gKgaiB+lIL3AJX9SA8EUMli9v1vf7BY7YsUuT83+XiilocdWOOlrLKpZPf/mj7ezgRSv6gAPxi0rIA1TJQBAhLgQu4YsaMfWFJ7UG7mYqCNlxPn5rK/vBA37itvCNv+t09wrLAw2EL2ohD1AVA6EEnwhcwhcGEL6wyEzgjlMyYsdNbj+1v+Vmv21fcSfv0Z3EbZIMhBZskQeoioGAgm0ELvELwwhfKJkP3HHmtvZ3h9pZe0UfrJP6+8NtfWjBHgOxBTvkAapkIK6gR+BaYCCkEA+iGFVxG7ibOHDRSvble9vyUJ3G1z7Z2XoyDZRhIMJgizxMVQzEGKo3QeA2s+NWQPzCGcIXk4otcO+4qpl9/u62u2XJhX/+Qidb3tGcfkk2UIaB0IIt8gBVMRBpmF7pwN2dh+2gPSOtgPCFQ4QvRjm8I57AvfPqZvZPn+5k7aY+Vie18sixtb9syAMkyEnSQBkGYgt2yANUyUDAYXNTB+44hK+YgVhCPJj6pu3w9jgC94O3NLvXAHmc3HZax7LPHGlrrlACyjAQW7BFHqAqBsIOK2ECd7LwJX4JX3hE+Kbh0GX61zCLAxeuZB9abGUPfiOP244+VqeJ26/8TSc7uivc9JbwRTAGQgu2yANUxUDwpaa2wGXqa5iBYEIcCN+4HLxU/xqmtX9+Jfvoe1rZ97/l647bQd/6XCd7/3W24pbwRSUMxBbskAeokoEYjJGJwCV8jTIQTIgH4Ys63ZWH4Tc/28k67bVJaLH3trgWqPXosaz5w7V9rSs/OJY9+vBq9uhDq9kPv5/73mr2yIOr2Q++u6b4flXcfi8P82L6rI5W4he1MhBbsEUeoCoGItEz04HLcmejDMQS4sHUFyEsbVvJ7r6xmd373lb20cJ7WtlH3p17Vyv78Dtb2Yfe0eoGZLE/95635xaa2Qduzt3U7P68u2/If+5ftDRLk/Mov29/q/sexr7HuTjIgwo+GAgt2CIPUBUD8eiBy8AlfA0zEEyIA+ELtSJ+647bYq/wNz7TyZYunvJ1z8VBHlTwwUBomdb7OO0f9LbRDpxf3gk/f+DXV39u5AGqYiAqLSFwQeDCJAIXSsXBTt/6fKfeuF09lt3/ldXuFHnq1z4XB3k4wQd1QFYhfx/98FyPyPx5amm+2XXwwtxFzexQYVvu4mZ2uHBJM1u+tOeyZnZkeys7ssOo7T2Xrb3W9dd96dr76Oq9r+577Cned9eFax+L4uOyHthj/gzIQ5PANSGqwJ08fldA+MIhwhchFQdUfeGednefbp2BW+z//dSBdrYvxJ+/uXjIowo+CGJ1MFSXLjgeqP04HQzTIvbk4RmL7cfDuR/L3UgeiOODxV8a5J+XA8XnZ85AkBK/BC7hGzEDsYR4MPXFrIq4/PRSuxubdcZtM4/pIqqLuK79fc/FQR5U8GHCYF2fqPYnqUOhan56is3DuPgcFp/L4nPai+JDxee6mKBfEHkQGwhRAtdE+BK/hC88InxRhipuC1/8oChuNzMXB3lQwaTupPWCtaXA60uA++FKtCJ3dFDx56EXw/0QHozg7vReHayEL4HL1NcxA8GEOBC+GLS8s5k98I+r3b2wdcZtu3Usu+OqGfbd1m0uDurAQg3xOjh17YXr8vY8Xi9vTcZAbMGOo+OMi+DzI5oCG4hXApfwTYuBYEI8CN+0HLxkJfu7w+3uKcZ1xm3x+31id0v+/iuzRVR6oQ40lPC2gYgtYqI/eS0iZNKAnZaB2IItY+N3Ry+ALxsI4OLP7gWRBLCBqJ0ucOfziCvLQGx6wDJoAwyEFOLANNiv4kqeT+5pZT/4br1Lk4tJsWzfrRWBApUgjsTbRkTspTVHLEGMgEZOgIul8v0Dss6PIH4FQRwmcAnfQPG7AsIXDhG+dhX7bj/y7lb28P3177striHaf6H+Y2CSgWglfuszHLGHi4idZimxZwZiC3acMP0dmvxGG74VxW+9gUv4Er7eGYglxIOpr949Nze7d8/WHbc/fGg1O3ip/v27ZCBaCd/ZQ7a7Jza1iCV8UYHhqe+G8L2gd+iVOlLF4WsjcInfQOFL/BK+8Ijwrc+XPiTYd7t6LPv83W35e4+OgWglfNfsP38oZOveG5sCA6EFW0Ytd041fO0HLuEbKH5XQPzCGcK3Wn/71y1J3H7hA+3s8A5HpyZ7ZyBaYw1fQtYoA7EFO0aG78Vxh6/fwCV8CV/vDAQT4kH4TubuG5pZu1lv3Ba+fl8nu/Nq4tYMA+HqJX6L5cXFlTssLXbMQGzBls3C1/PdvvEFLvEbKHyJX8IXHjH1PdGBC1ey7369/n23D317tXug1b4L9B8DbMFAtCrDtz+ZPXQxU9kkGAgt2NIP3+61Rg6jN63AJXwJX+8MBBPikGr4Fqcmf+2+Tu1xW0yLP357qxvX6o8BZmAgWqsO3/35+1rKn4UObeudXlw81KqDCzYYCC3Y4iV6CVzCN2D8roDwhUOxhm8Rt58+2K4/blvHulF94CLN+0YNDERrKflrLe5dXrqod6csS40xLQOxBUMGo/d8AtcnA0HpBeErZiCWEA/vU997FprZA1+tf2lysRz6g7ew7zZZwqDdf8FazB7MHzwPX0bMogbq0IIZy5eurQw5mLdT3QdZEbjEr6HwJX4JX3jkIXyP7mpm3/p8p/ZTkx/+zmr28dta+siCPaGCtrgWJH+wXC4eMtWxA/QZCC6IbW91D6krDqsrDq0LubSZwCV8zSF8xQwEE+JgJXxlcXv/avaJ3cQtJlR2H23+Yw/Mr6xd0cN0Fp6pwwsy/SlvcQ5AcR7APgI3EgaC0gvCV8xAMCEedYVvse/2ix9sZ81H6o3bwpfvbWdL2wwEE6JQnL594EKWGyMhBgIMNbts7fT2weAdRODGwEBUesByZzEDsYQw9go+v1UGbhEE97y9mT3yYP37bld+cCxb3sm+W0yvexjU+nJjghZYp44w1GZ5i+AdF74EbkwMxKYXBLGYgXhDPMbF7V3XNbOvf7qTra7WG7fFtPhjf83SZExm/4V50BankBankaoDAoiNgVjD7LrB21/SPDc+eAncFBgISi8IXzEDsYQ4LF/RzL704Xbt+24Lf7/clscS7Cv+EqY7oSVoAR0D0Ybpre/hvWBj8BK4KTAQjl4QuGIGwgj+7btwJfu7PDI7rfrjtrjvVh1OMOr83h7aS1hyDJhhINJQnW7wXtTMfvInf/Ksn/iJnyBwk2UgKj1gn6+YgWiCH0evbmYPP1D/vttir2933+35K0Hv84Uf/X20h5nSAr4YiDVM7/GPf/xZuec95jGPIXAxwEBUekH4ihkIKtjyjx/v1B63K48cy45c0Sx3AJaB8EIYxandBy7iHlogagYCDpvrB26OwEUJBoLSC8JXzEBooX6HLm9mj3yv3ultsRT6M0fbwe/zhU3dKW1xdc92lh0DSTMQdmgRuKiYgaj0gOXOYgYiDOF85L2t2qe33/xsJ7vr+pLT22kZCDmsWT8c6lKWHQMowUDwpYbARXgGotIDwtcAA4GG6e3ftpJ9+d52rXH74DdWs3tuaZ7wWoLG7iADwZcCprQAKmcgBGNF4ELHQFR6QfiKGYg3bG15V72HS33vW6vZBxdbE71GwteJ8wdPPDbwIAwgLQYi0TMCF/YYCEovCF8xA1GH4/72tvqWJ3fax7L7DrSyAxdX9/qJX63Be2nlD7cAMIqBePSAwIUvBqLSA5Y7ixmIvdQc3N7MHvhaPdPb1dVj2Xe+3OkeaFXHeyN8wymWHh9k6TEA7wxEpSWlA/f2C5vZuvnj5MEDFAxEpReEr5iBGIzRXTc0u+FZR9wW+27v/cvJliYTvkac31t6zDU+AFJhIDh9BO4484QvjDEQlF4QvmIGItGzQzua2Sf2trIv/00n+/aXOtkPHwozzX3kwdXsvqV2ttf454zwPW5w6TGnHgNAj4EQ9RG4hC88MRCVHrDcWcxALHlTLB3+0Dtb2acOtrOvfqKTffdrq927ameN24e/s5p9qojbef17NB2+5xuJWpYeA8DkDASqj8AtEb/y2AH6DESlB4SvAQaCyboiRov9uXde18w+8p616P3ih9rZP3y0vC99pJ195s529oGFZrb/Iv17Inw3n9QStQAQgIFw9RO4TIPhnYHY9IIgFjMQUoiHhSjedz5RCwBmEbhMgxEhA1HpAdNgMQOxhHiEDt7+8mOu8wEApwhcwhcRMhCVXhC+YgaCCXGYKWzzP4sHioOitjez5Z35A8xm1A9uAIDpEbjVhC/xCzMMBKUXhK+YgWBCPDaN2mJSu1XUlqF+aAMATI/AJXwRIQNR6QHLncUMxBJ8239RMzuYR+3hKqKW+AWAuBG41cWvPHaAPgNR6QHha4CBeIJN+y5aWY/a5RIIXwDAOARuxeFL/MIMA1HpBeErZiCwUL/iCqelS/KovbxZKmoJXwBAGQQu4YvUGAhKLwhfMQMRhmp199UWJyDvqC5qiV8AwCACl/AFjjMQlR6w3FnMQKhhMv0lyHVHLeELAOkhcC2aJ3xhjIGo9ILwFTMQc1hzfAmyPmIJXwBIx4bA/emf/uln/ezP/uyv/PzP//yZj3vc456ff+OvPuEJT/i1k08++cXy6EvJPIELYwyEoxcErpiBsEuZcgkygQsAKGwI3Oc+97lnnXnmmS949rOfffYZZ5zxwtNPP/1Fp5566kue+cxnniOPPrCsGfYYCEovCF8xA/EXs/0TnoLsHeELAHYRuDGYJ3xhkIGo9MDyft5i36T6NRC+doU4Bdk7pr4AoEfgxm6e8IUxBqLSA8vhmwwDEWlNTEuQCV8AiBOBi2z3IHX8AMMMxKY14+O3+iAupnTy0PTCQICGsu/ClWzp0nSWIEcXvgQxgIQQuChnvsk0GPYYiE0PmAaLGQjUae3fxrTWGlfxW/w6V6w5uqvnylZ2x5Xt7I6r2tmdV/dcs+auvmtHuK6dvX9Gxa8x8te+9vjvfeegq9deZ6F43d3X33s//AUBYBeBi9nNNwlf2GIgKr0oE75McQMyELHDvF/vk6rKA7eIuF6QHr0qj9LBEB0IzrsL1+duaGcfKNzYzu5JTPGei/fe/TgMBnUvnjfEci+UiWQgHAIX4cw3iV/YYiAovWDim174dk9C3s60NkbDwdqP1Q2h2o/UItpumoKB0PRqOI6JYmA2BC7qN98kfGGPgaj0gOXOcYVv/9AoTkL2rQjXI0UEFUFUhFEvXO/Ko+n9RTzlAfqBEaYKWeJXrvhLiOIvI/pBvB7DV/aWUBPBSByBC1vmm4QvbDEQlR4QvgZMELYcGuVHd2o3GK8lwnVWhK9/3Qi+fuNEuLuXuD8JNhAhQCgELnyYbxK/sMVAVHpB+NoJXw6Nsqm7dLjY5zowfQ0ZsIQvuhF8w/EI3hDAO/WBAsyifOBelMfFIHXwAIX5JuELWwwEpReEbz32Dk5rrxhgIOxS0o3YYgrbD9hiz+WN+mh1Fb8GojAVgxNg4hfeTB+446iDByjMNwlf2GMgKj1guXM19m3rHRo1GLVlGIhBz9amsWvLifuTWHV8Rh++xK8sfu9i6TMMqj5wCV9YN98kfGGLgaj0gvDdwvxKduCSZnbo8inClvidLGSLh/n+smKjS4otI3zj1I/f7r7fq9fuDyZ8Ubf6Apf4hXXzTeIXthgISi9SD9/u3bWjliHXxUBwBo3Z3iFPd0a4tNgiwjc+hC/qZCNwCV9YNt8kfGGPgaj0IPbw7Z6GfFketoqojTR8+3tl12PWQPChxvAlfusP3+uGwnenPpDgm+3AJXxh3XyT8IUtBqLSA+/7fPcX+2t3BFqGnFD8rsfstcSsZ4RvfAbDd32Pr4Fwgg8+A5fwhXXzTeIXthiISi8sh+/+iwPur7WCmEVFCN+4DC5zJnqxmbgCl/iFdfNNwhe2GAhKL1ThW+yvPdDdXxt52FYcvsW+2e5JxsQsRiB843DC3l6uMkJSgUsQw6v5JkEMWwzEphezRPHe3v5aeVg6sGHfbHEtz809BkIKcWAa7MeGO3yJ3iSVDtzb8ujrk8enmjp4gMJ8k/iFLQaC0ovNwnffRVPeX5uQE6azN0/IQDAhHoSvDxuWN1+hjzAYC9xx5OGppg4eoDDfJHxhj4GotG7fxa3s0OVFwLWH6INSrXvfbP5getcNUwYt4QsBpr62FZPe7pT3Gk5vjk2lgUv4jqEOHqBvvkn4whYDYam0J/8Y7L8kD9v8wepwHrPjnBi9ccdvN2h7y43vDhWzxC9ECF+7mPLGgcAlcJGS+SaBC1sMRKYqbA9cmoftFZuHbSqBu2FCqw5ZAheBEbh+MOX1qZbAJX7HUMcO0DffJH5hi4EIDRa2l5UP2+njVx+tmwbtlb2gvd5w0BK+qBnh68PglJfgtUkeuITvGOrgAQrzTcIXthiI1FnCtqqo9Ra+RdAeneVQKI8MBBPiQfjadfcNBK81ZgOX8B1DHTxAYb5J+MIeAyF7Qthe2A/beuNWvtx54NqeZIKW8IUAU197CF49d4FL/I6hDh6gb75J+MIWUdgu1TyxVYdvcRet+X201hkIJsSB8LWD4CVwCV/CF7GabxK/sCVU2G73FbbTx2/r+GnH+UOcPA5jZiCYEA/Cl+CNXRKBS/iOoQ4eoDDfJHxhD2E71pGr22tRWzws39wZoQ3CFw4x9RUFb+/Qqu4pzQbiMAZJBy7hO4Y6eIC++SbhC1uGwnbvRfGH7fKuPGqvaWd35g9h77+5WH7c2dLo8CV+iV94RPjWZ/1aoqu5h5fArZE8PpXUsQP0zTeJX0jt3ZaH7Y48bPP46zIQopVOaa/MH67W99NuHbSTIHzFDAQT4kD41hC8N6wFL8uZCVzCV0EdPEBhvkn4Iqhu2F4+ELZbMRCrk0RtsfT4rhurj1rC1wEDwYR4EL4BYvfGteXMd17Tzo7u0kekZQRuYPLwVFMHD1CYbxK+mEkRtgcnCVsn8XvkKm3UstzZAQOxhHgw9a02eJnuErhuyKNUSR1CQN98kyhGmLAVB3E/at9vOGqZBjtnIKQQD4K4nO5hVUx3JwzcbfrwS508PtXUwQMU5puEbwImXoqsRtQSvh4YiCXEg2nweB/oX0V0ZZrT3ckCdxwD8ZcyeXiqqYMH6CN83dtz0dDhUY6tX+eTeNROH77EL/ELjwjfodi9Mb2lzNUELvFrljw+ldSxA/TNN4lf47phu91/2K5PavOHr7sXOuMZiEovCF8xA8GEOBC+7fWlzLFfQxQ+cAlfk+TxqaYOHqBA+MrtyT8PB5yH7XJxpU9xUNRNW0RtGQaC0gvCV8xAMCEeqYbv3b2lzEev1EdpHIFL+JokD081dfAABcK3nrC9rJUd2uU0bot9Vdf2Tj+eNWqJ3xrCl/glfOFRSlPfmJYy2wtcwtcseXwqqYMH6CN8Z5N/DPdf6jdsj1zTzu68IX8IWagxbAlfwjcWBoIJcYg9fL3Hrp/AJX7Nksenkjp2gL75JvG7hW7YXuEvbLuHRV2fP2zcbChqCd8a4rcNwhcOxRa+HmM3jsAlfE2Sx6eaOniAAuGb7b/EX9guX1XhvlqLDESlB4SvmIFYQjximPp6id24A5fwNUkenmrq4AH6Ig/ffUXY7nQUtsVhUXXvq7XGQFR6wHJnAwwEE+LgOXytxm6agUv8miWPTyV17AB9zqe++y5uZgcdhW33ap/rje2rtcZAVHpB+IoZCCbEwVP4WpvsEriErwvy+FRTBw9QMB6+e4uwvdxR2KY+rSV8Cd+UGAgmxMN6+Kpjl8AlcF2QB6aaOmyAgtHA3Zv/O7LkJGz7d9a6OzDKKgPh6AWBK2YgihAP64F7QuwWV9sRuI4YiL+UycNTTR08QEEUvnvyfweWdvgI2+Ik5OJ6H3kQpsRAVHrAfl4xA7GEeFhe1lwsY77r2nZ29EoCN04GwjBl8ihVUocQ0DdDFO/Jf/6B7UXYGo/bKyM/CTk2BmLTC4JYzEBIIR6KIP7ADb3Y3UXgxs9A/KVMHp9q6uABCpuEbzdsL2tlh4yH7fJVTu+tBfFL+PpmIJYQj7qmwXfnsXvnNe3syBUEbloMxF/K5OGppg4eILcvD9uDVxRxqw/YscuQr+HQqOQYiEoPWAYtZiCWEA8PsUvgemYg/lInj08lA9GD+O29NA/bXXnYXtkeb9dxqmXITGuxgYGo9ILwFTMQTIhD1bH7/uvb2R1X92J35wACN2EG4i9l8vhUMxBG8G3vJb2J7WZhu5WA4bvM3bWYhoGg9ILwFTMQTIjHzLF7XS92d7bGI3ATZiD+UiYPTzUD4QTb9l7SzJZ2zhi2AcOX05ARjIGo9IDlzmIGYgnxmDR0i59z13W9k5g3iV0CF4SvEfL4VDIQVtDac3ENYTtB/LK/FmYYiEoPCF8DDAQT4jDxfl0CF8SvL/L4VDIQXghrT/415sDlBsJ2lKvy/3AW1/zcXCxF7qyTBw9QMBCVXhC+YgaCCfEYNdXtLmG+aorAvTV/CBkkjy7oGYi/lMnjU81AnGF6u7fZDdvDedgevT4P24X8P5pv72xugfCFQQai0gPCV8xALCEe3di9ce1+3ZNPPnm6wN2MPLxA+CZMHp5qBuIN4xVhu3+HzbBdvrqd3XFDEbUlwraMBcIXxhiISg9Y7ixmIJbg23Oe85yz8o593lOf+tTqApfwBeFrkzw+lQzEXcp2X9QPW3txe+TadnbnTRVF7QThS/zCDANR6QXhK2YgnmBfEbi55+XCBy7hi7EMxF/K5PGpZiAAY9UN2+2Gw/bmGsOW8IU3BoLSC8JXzEBUwY7ygXtxuMAlfDGWgfhLmTw81QwEolsXrYXtwV0Gw7Z/cJQ6aAlfeGYgKj1gubOYgdhC/SYL3HG2Eb+omYH4S508PpXU8WhZ/vHZd5nhsC1zcJQnC4QvjDEQlR4QvgYYCDGEUU3gGopfeXhBz0D8pUwen0rquCRsT3D4qkjDlqkvvDEQlV4QvmIGAg2zCR+4xoOYKIY6CFMnj1I1dZhGHLalr/rBhiiWhxDQZyA2PWAaLGYg6LCRvcAlfGGFgfhLnTw+ldThWoLlsK3sqh8wDYY9BqLSC8JXzEDspchP4BqKX3l4Qc9A/KVMHp9qhO2JYXt1HrZV3mELwhf+GAhKLwhfMQMRGLM4ApfwhRUG4i9l8vBUSzBsl/OwveNGotaUBcIXBhmISg9Y7ixmIA5jEHfgGglf4hfq8IOB+FSKcY8tYevTAuELYwxEpQeErwEGwtELArcm8sACgZs4eWQqTRG2uy+yeY9tN2xvIGzdWiBwYYyBePSAwDXAQDh6kWbgEr6wxED8pUwen0qbhO2hK42F7VXssY3aAvELYwxEpReEr5iBoLSGwDUav/Logp6B+EuZPD5rtjv/Orf/8jxqryrog3ZD2HIqcroWCF8YZCAqPSB8xQyEJoHr1TbiFzUzEH8pU4do1fbkX8cO7OxFbRk1xu2R67jHFptY6BC+sMVAVHrAcmcxAwFK4Hq1jfBFzQzEX+rUsTpR2F4yYdjWGL6ELWay0CF+YYuBqPSC8BUzEKcErlfbCF/UzED8pUwds4P2XtrMlq6oMGwrjN9u2N5M2CKQhQ7hC1sMBKUXhK+YgWglcL3aRviiZgbiL2W1hu1lrWxpV81hWzJ8j1zbzu4kbKGy0CF8YY+BqPSA5c5iBmKWwPVqG/GLmhmIv5RVGbbrd9iqY3aEYmLbDdtbOhupgwfoW+gQvrDFQFR6QPgaQOCC8IUbBgIwZaXDtrjD9kqbYbt87Ziw3Yo6doC+hQ7xC1sMRKUXhG/84UvgpmZbGPLogl0GojAFRdTu3mY7bA9f087uuGmKsJ2FOoSQrLuHqQMIGGYgNi0ZP/Ulir0FMYGLoOFLFIPwDe/2/OO5b0crW8rD9mAekmXVGrY31hy2hC+8WOgwDYYtBmLTC8LXZvwSuDAXv/Lwgp6BaPTg9ovXwnaSqK0zfA9f3c6OdsPWWNwSv/BgoUP4whYDQekF4atF4GJ62+oljy7oGYhKC3Zf0sz276w+bKsK327Y3lCciuwsbAlfeLDQIXxhj4Go9IDlzgQuvNpWP3l4gfCtwZ7LWtmBK+oP29Lhm4ftkevb2V2xhS3hCy8WOoQvbDEQlR4QvgQuvNpWP3l4Qc9AmM6i2F+7d/vk+2vr1r3yJw/bu/LgGySPT8IXYOoLewxEpReEL4ELr7bVSx5d0DMQr5uGbf7vxb7L105EVsfrZpbHhO1W5PGppg4eoLDQIXxhj4Go9IDwrSJwL8nD4BIDIYS0bKuXPLqgJw5b1f7aqcJ2YfKwJXy3oA4eoG+hQ/jCFgNR6QHLnacJ3M2oYwjp2FY/eXgh6vDt7q/d5SNs7wgQtsTvFtSxA/QtdIhf2GIgKr1IJXyrDVzCFxZsq5c8vKAX+f7awuFr87C9WRO2hO8W1MEDFBY6hC9sMRCUXsQWvvUELuELC7bVSx5d0HO+v3Y9bG+yGbaE7xbUwQMUFjqEL+wxEJUeeF3urA1cwhcWbKufPLwgsfvSZrbf4DU/I8P2mnZ21GnYEr5bUAcP0LfQIXxhi4Go9MB6+NoMXOIXFmyrnzrAEMb6/tqr21sjbIlfwhepW+gQv7DFQFR6YSF8SwfuX+dx2SePXMIXaiWDlfBNWP7nZO+O3v7aMmErDt9iKXLKYUv4bkEdPEBhoUP4wh4DUelBneE7VeBuRh66hC+UKoxawten2/OvO/u61/xUFLaBw5ewJXwJX0RhoUP4whYDUelBiOXOlQeum/AlflGnGqOX+NXYs32CZcgGwtfz4VFeyONTSR07QN9Ch/iFLQai0otpw7e2wCV8gTEIX7e609rLW9lSXdPaChy+jrBVk8enmjp4gMJCh/CFLQaC0outwlceuK7iVx1CSAvha9aey3qnIRsI1onCNv+if9diZzwD8ZcyeXiqqYMHKCx0CF/YYyAqPejHrunAJXyBEWoOX+J3TXF3baWHRlkK260YiL+UycNTTR08QN9Ch/CFLQai0iKXgesmfIlf1InwDaJ7d+1OX1G7HrYLM4Yt8WuePD6V1LED9C10iF/YYiAyCVzCFwiL8E1iWltr2BK+psnjU00dPEBhoUP4whYD8Ungphi/6hBCWgjfjdPa9b21hC3hGyd5eKqpgwfoW+gQvrDFQJgSuKmFL/GLOtUcvsr49TytLSx7CVvC1zx5fCqpYwfoW+gQv7DFQLASuIQvEFYk4bvH8bS2cOT6dnbn2yMIW+LXPHl8qqmDBygsdAhf2GIgZAncFONXHUJIi4PwLaa13XtrnU5rD12Th+0NedjekkjYEr6mycNTTR08QGGhQ/jCHgI3fvLQJXyhVHP4jopfj/fWbgjba/OwvTGPWsKW8HVAHp5q6uAB+hY6hC9sIXDjJw9d4hdKoSM3/z32Xt7KDlzVypbySFwyEKqTOpyH7dFZ77AF8WuIPD6V1LED9C10iF/YQuDGTx65hC/UZgjb4iTkfVccj9oy1CE7LJqDozwxEH8pk8enmjp4gMJCh/CFLQRuGuShO0wdQkjLZtPaHa3swJWTha218F2+Pg/bVA6O8sJA/KVMHp5q6uAB+hY6hC9sIXDjJw/dUdQxhOjtzqN2/65qo7b2+O0fHEXY+mIg/lInj08ldewAfQsd4he2ELhpkwfwMAPBBPtuX1+CnMvjcGriIO6eiHwjJyInxUAUpkwepWrqEAIKCx2CGMGVD9xL8ygaZCDQQPgiDbflX3P27uwdGDVL1BoI34PFicg35WGbB0+fPLxA+CZMHp5q6uAB+hY6hC8qMX3gjmMg0JBI+F6iDy+Ec1v++d1zeSvbf2UNUVtD+B6+bu1E5MGw3Yo8vKBnIABTJo9PJXXsAH0LHeIXE6k+cAnf5MgjdxQDgYYpXDKwr1YdtFXEb/59yzesHRw1SdgSvtiSgfhLmTw+1dTBAxQWOoQvRqovcAnfJMlDd5g64DDS7u0V7as14uB1vWXIt1QbtoQvtmQg/lImD081dfAAfQsdwjdh+sAlfpMkD91RDIReSio7LMqQw9fnYbtQb9QSvyB8fZDHp5I6doC+hQ7xmwDbgUv4JkceuaMYiMFYFFHbPSwqoqhdura3DLnmaS3hi8oYiL+UyeNTTR08QIHwjQqBC1PkMTuKgTD0bD1q6zgBuUbry5AXfYYtgYt1BiIvZfLAVFOHDVAgcKPiM3AJ3yTJQ3eYgXi0KtaoLRy6zu4yZMIXlTIQfymTh6eaOniAAuHrUlyBS/wmSR66wwwEJlFbPc/LkIlfEL7xkIenmjp4gD7C16x0ApfwTY48dEcxEKJEbXmxLEMmfFEbAwGYMnl8KqljB+hb6BC/BK5RBgINYcgjdxQDsUrUHlechnw0gWXIhC9qYyD+UiaPTzV18AAFwpfANctAoCEceegOMxC0G6I2ptOPx0xr72BaS/iiPgbiL2Xy8FRTBw/QR/gSuGYZCDSEIQ/dUeqI2ivijtrutPaGdnb07UStNfLwAuGbOHl8KqljB+hb6BC/BK4zBsIN4cgDeBhRu657EvLN7K2NiTzIoGcgClMmj1I1dQgBBYKYwDXNQKAhDHnoDkklag9eu3YSMtPa9MjDC4RvwuThqaYOHqAvofAlcL0xEGgIo66gvS3/c7R7Ryvbt6sI2lwefmMZCFOmtQhFHl7QMxCAKZPHp5I6doC+CKe+pQP3r/KH4mHy2APhm4CqprR7dray/VdtEbRlGQjXLae1N3JvLaYjjy7oGYi/lMnjU00dPEDBcfjOFLibkQcfCN8EbBa1u3c0s727ekuPq4haB+FbXO9zhOt9EIg8uqBnIP5SJg9PNXXwAH3GwzdY4BK+DhgINFTn1svyqL28le27ssagNRC/h7jeBwbIwwuEb+Lk8amkjh2gz0j41h64hK8DBmINW7s1/1zdvqOZ7dnVyvZf3coO5BG5FXnkVhS+LEGGF/Lwgp6B+EuZPD7V1MEDFGpe7mwmcAlfBwxEXepu2762l3bfVeWCdhLy0N0qfK/t3VnLEmREQB5d0DMQfymTh6eaOniAQqDwNR+4xK8TBuIvRv1lx3uvzIP2muqj1kP4FlG7tq829w59mAChycMLhG/C5OGppg4eoG+G8HUduISvAwYi0ZvusuMryi87VgkZtYeuH4rashaBeMnDC3oGAjBl8vhUUscO0Fdi6htl4BK+DhgISStuK6a0O9cOh1JHqzJ8Dw4eFjVJ1BK+SJw8uqBnIP5SJo9PNXXwAIWB8C0fuJfpA5X4TYCB4AytezhUsex4gsOhYjEqaovDoo7eEiBqCV8kTh5d0DMQfymTh6eaOniQrMkCdzOCKCV8E2MgTmcJWg/LjmuRR+2hYl/t29vZHXlk3qEIW+IXiZOHFwjfxMnjU8lAACFu1QUu4QsVAxE76Lb+wVAJTmjHWcqj9vCNvahdPB62W5FHLuGLxMjDC3oG4i9l8vhUMxBH8C984BK+UKkraLev7aFVnnRsUTdqb8qj9pbyQTsJeegSvkiIPLqgZyD+UiYPTzUD0QQ/dIFL/EJpxqDd0z8UiqDdoLunNmDUEr6APfLwAuGbMHl4qhmIKdhjM3AJX6iM2j/bu7Zn31UE7ciovT6P2pvb2dEJlh4Tvh3iF9GThxf0DARgyuTxqWQgsqDjK3AJXwR26/Y8aHe2sj39/bPXtdcYCElLuodELdiPWsIXsEceXdAzEH8pk8enmoEAQ1hxBG5i4Uv8ViT/M3Lbjma2+4pWtveqPGivHQjasgzEZi2uOx61kxwS5Z08dAlfJEQeXdAzEH8pk4enmoEwQzXiDtwE41cejYb1p7PFYVDrpxtPGrQJxe+Gk48NxKYl8tAlfpEYeXiB8E2cPD6VDAQbJpNu4BK+UevG7OVrS427e2enmc4mGL79/bTKQ6I8k0cu4YvEyMMLegbiL2Xy+FQzEHM4EYFL+LpnOmath+91ce2ntUweuoQvEiKPLugZiL+UycNTzUDkpYzAJX5dxW93z+zOCGJWGL/r99Oy9NgEeegOWwTiJg8vEL4Jk4enmoH4SwGBS/iaDN+1qWzvAKhiz+w1NeyZ9WjCpcdMaf2Qh+4oi0C85OEFPQMBmDJ5fCoZiMKYELiErzR8h0N239UJTWUDKqa0h25M79TjFMgjd5RFIF7y6IKegfhLmTw+1QwEozcEriUGIjWU2/r7ZAnZYA7e0M6W86A9UgTtOzujGQg0JBS/i0C85NEFPQPxlzJ5eKoZCEmrCFwvDETqlhPc/HXeumPtKp7du9bult13TXG/bDvbf91o6ij0rBu0N/eC9h2bRG1ZBgINYchDd5RFIF7y8ALhmzh5fCoZCEw1Atc7RchuHxOyYyJ2Gup4tKjyoCV8kyeP3FEWgXjJwwt6BuIvZfL4VDMQnwQuag/f/hT2tstb2e1XrAXsnjxg91699TS2DurITCJoCV+UCdG6LQLxkkcX9AzEX8rk4almIEoJXExtLV6bJ8brtUW8VjuFJX6nDNpbjAYtUYxZI7Vui4B/8vCCXQbCMHby8LTKQMSWDtwXvOAFZz3/+c9/QR65BK4zf52H6615uN62c8zk9Trf8RpbEPdPOd7yUKhUGAg3hCGP3FEWgXjJowt6BsIwZfL4VLMWuL/927991stf/vIXvOxlLzv7N37jN154zjnnvOjFL37xS84+++xz9ly9Fky7r8wDatdaRBUxVURVMRUs9mWqIy8K24/vcR0M1uJjXnzsi89B8blYn7oSri7id+n6PGhvymP27QN30aqj0gMDgYZw5KE7bBGIlzy6oGcg/lImD081K4H70pe+9EV55L7k13/9188pHwdr4VVMDff2ovjEMF6Lt/U47gWy10juv/au3vu5dcfxSF0L1eaJoTowYd3nfHlwKiZZbny4t9z4aKzLjdUMBBrCkIfusEUgbvLwAuGbOHl8KvkI3Cr1YrkfzL1oHrRnIKIHFRG5wa4JDUXoYIgyOcWgImg3LDcmaAlfpBG+79CHCRCSPLygZyD+UiaPT7U4Axewp7/cePnta0F7NI+qceSxB8I3AfLIHWURiJc8uqBnIP5SJg9PtcoCN3+oP4GB2ABC6S81PnRzuZidlDz4QPwmQB66wxaBuMnDC4RvwuThqTZp4O7Lg3bfqMgdx0CgAGUVU9mDN7WzwwvH981WGbOEr1MGAg1hyEN3lEUgXvLwgp6BAEyZPD5rtCFwX/nKV24ZuJshfGFddyp7Y7ipLOGbCAOBhjDkkTvKIhAveXRBz0D8pUwdo8ED9w//8A/PeuMb3/iCP/iDPzj71a9+9Qtf8YpXvOg3f/M3Swcu4QsrDlx/PGQP90NWOJUlfhNhINAQjjx0hy0C8ZJHF/QMxF/K1JFaeeC+4Q1vOPt1r3vdC1/72te+6Pd///df8nu/93vnHHlnHgp5JBzKY2Epj4b9NxK40Fu6YW1p8aGFdrZ8S38iG2/IErjGGYgwhCMP2mGLQLzkcQU9A5GXMnWk1hO47+pkJ8qD4h0bw/dAHhv7b6gwfInf5BXT2KUb85DtTWOXF9f+3KUYsoSvYwYCDWHIQ3fYIhA3eXiB8E2cOmADB+4m3rkWIkX8HuzHb8mpL+GbngM3rEVsd0nxwDT2SMTLiglfEL5xk4fuKItAvOThBT0D8ZcyddiGD9yS8VtMfg8uHA/graa/hK8/3QlsfylxfwpLwJokjz0QvgmQR+4oi0C85NEFPQPxl7I0AndLa+FzQgTf1JsCj4hgwlcTrv3Jaz9ei72w/UOdUt0PGyt58IH4TYA8dIctAnGThxcI34QlFrglI/idQyF8y9BE+KbNp8JE8YnBujQUrIcXhiau7H9FSfIIBEGcAHkAj7IIxEseZNAzEIYpizxwp4/iIoj7UbwexgNxXEwhiwONCsXUuD85LqaVBWvhuz5JHYjTDRPVgUjdEKrEKkTkwQfCNwHy0B22CMRLHl3QMxB/KUs4cGdzdKT2ce88PlXeYHFCwz//Hf07XAfpIwWomjz4QPwmQB66wxaBuMnDC4RvYgjcYOE7giAYgBjIYw+EbwLkoTvKIhAveXhBz0AMxojAtRC/gmAAYiCPPRC+CZBH7iiLQLzk0QU9A5HoGYFL+AJRkgcfiN8EyEN32CIQN3l4gfB1gMA1huXOQFjy2APhmwB56I6yCMRLHl7QMxCWVhC4jhC+QDjy2APhmwB55I6yCMRLHl3QMxCcBC4IX8AYefCB8E2APHSHLQLxkkcX9AyEKIGLMOFL/AJTkwcfiN8EyEN32CIQN3l4gfAlcEH4ArbIYw+EbwLkoTvKIhAveXhBz0C8ErgIE7+CYABiII89EL4JkEfuKItAvOTRBT0DUUvggvAFjJEHH4jfBMhDd9giEDd5eCHJ8CVwMROWOwNhyWMPhG8C5KE7yiIQL3l4QY/AhUeELxCOPPZA+CZAHrmjLALxkkcX9GoN3Hfn0TIJA4EFX5gGA2HJQxBEcQLkATxsEYibPMhgLojDBS7xi4oQvkBY8tgD4ZsAeeiOsgjESx5ekCFwYR6BC4QljzoQuAmQx+woi0C81JGF1AKX8EVFCF8gHHnsgfBNgDxyR1kE4qWOL6QWuIQvKkL4AmHJgw/EbwLkoTtsk2gAYqAOM6QUuIQvKsJyZyAseeyB8E2APHRHmTIoAA/UwYaUApf4RYUIXyAceeyB8E2APHJHqTg0AEvUIYfUApfwRUUIXyAsefCB8E2APHSH1RQggII68FKXXuASvqgIy52BsOTBB+I3AfLQHSYOEyA0dfylgMAlflExwhcISx57IHwTIA/dUQzECRCKOgpjQuASvqgR4QuEI489EL4JkEfuKAbiBAhFHYseEbiELwwgfIGw5MEH4jcB8tAdZiBOgJDUIWlV+cB9T/4g3qcOSK8MhBR8YbkzEJY89kD4JkAeuqMYiBMgFHVgqk0XuOOoA9IzAzEFXwhfIBx57IHwTYA8ckcxECdAKOrw9Bm401CHpVcGAgu+MA0GwpKHIIjiBMgDeJiBaAFCUseqz8AlfIlfSBG+QFjy2APhmwB56I5iIE6AUNQR6zNwCV/CF3KELxCOPPZA+CZAHrmjGIgTIBR13PoMXOKX8IUc4QuEJQ8+EL8JkIfuMANxAoRE4BK+egZCCr6w3BkISx57IHwTIA/dUQzECRAKgUv42mAgpuAL4QuEI489EL4JkEfuKAbiBAiFwCV8bTAQUvCF8AXCkgcfCN8EyEN3mIE4AUIhcIlfGwyEFHxhuTMQljz4QPwmQB66wwzECRASgUv46hkIKfhC+AJhyWMPhG8C5KE7ioE4AapA4BK+dhmIKfhC+ALhyGMPhG8C5JE7ioFgASZRPnDfmz9AjqIOSM/UAemVgZCCL4QvEJY8+ED8JkAeusMMhAwwCoFL4PpjIJjgC4ELhCWPOhC4CZAH7TADIQOMMnvgEr6ErxUGQgq+sJ8XCEseeyB8EyAP3VEMRA7SFS5wiV/C1xIDMQVfCF8gHHnsgfBNgDxyRzEQP4ifJnAJX8LXCgMhBV8IXyAsefCB8E2APHSHGYgixMNW4BLERLF1BgILvrAMGghLHoIgihMgD+BRDIQUbPIduMQv4WuJgZiCL4QvEI489kD4JkAeuaMYCCxoxRu4hC/ha4WBkIIvhC8Qljz4QPwmQB66wwyEF+qRXuASvsSvFQZCCr6w3BkISx57IHwTIA/dUQxEGapD4BK/hK9FBmIKfhC+QFjy2APhmwB55I5iINYwOQKX8CV8PTEQU/CF8AXCkgcfCN8EyEN3mIGIw3gELuFrizogvTIQUvCFqS8Qljz4QPwmQB66wwzEHSYJ3L/o6MPRO3U8eqYOSK8MhBR8IXyBsOSxB8I3AfLQHcVA+KVissDdjDoevVMHpFfqgPTMQEzBF8IXCEceeyB8EyCP3FEMBGFsqgtcwpfwtUQdj54ZCCn4QvgCYcmDD8RvAuShO8xAKHoVPnAJX8LXGnVAemUgpOALy52BsOSxB8I3AfLQHcVARFpWOnCXqw5c4pfwtUYdkJ4ZiCn4QfgCYcljD4RvAuSRO4qBuLRgosAdh/B1Qh2QXqnj0TMDMQVfCF8gHHnsgfBNhDx0hxmITneBS/g6pw5Iz9QB6ZWBkIIvTH2BsOTBB+I3AfLQHWYgRt0Fron4JYqJYkvUYemZgciCPaXDdxxBSACeyGMPBHEC5KE7CQMBazZwzQaxOhy9UwekV+p49MxAZMEXwhcISx58IH4TIA/dYQbC1l3gyuNXHY7eqQPSM3VAemUgpOALU18gLHnsgfBNgDx0RyFwnYUv8Uv4Er7+GIgp+EH4AmHJYw+EbwLkkTsKgUv4JkcdkF6p49EzAzEFXwhfIBx57IHwTYQ8dIcRuARutNSh6JU6Ej0zEEzwhcAFwpFHHQjcRMiDdlhtgfuXeRz2GYhUwjdh6oD0TB2QXhkIKfjCsmYgLHnwgfhNgDx0hwUN3M0YCFW38asOR+/U8eiZOiC9MhBS8IXwBcKSxx4I3wTIQ3eUcYH7mte85sxXvepVz33lK1/5/Je//OVn/dZv/davvvSlLz0798LSgUv4Er8WqQPSK3VAemYgpuAL4QuEI489EL4JkEduz4bAzf/fabnTc2fknl18Y+87z5o5cAlfwtcidUB6pY5HzwyEFHwhfIGw5MEH4jcBaQVuYuFbW/yqw9E7dUB6pg5IrwyEFHxhuTMQljz2QPgmIK3ATTB+mfo6oI5Hz9QB6ZmBmIIfhC8Qljz2QPgmIL3AJXwJX4vUAemVOh49MxBT8IXwBcKRxx4I30SkFbiEL+FrkTogPVMHpFcGQgq+MPUFwpIHH4jfBKQVuMQv4WuROh49UwekVwZCCr4QvkBY8tgD4Ruh0oF7OI/BzchDlSC2H8REMVFMEPtjILLgC0EMhCUPQRDExlUWuIRvvAhfB9QB6Zk6IL0yEFLwhWkwEJY8+ED8GhE8cJMP34jjl6mvA+p49EwdkJ4ZiCn4QfgCYcljD4RvKoFL/OoDlfBNnDogvVLHo2cGYgq+EL5AOPLYA+GbUuASvnEifJ1QB6Rn6oD0ykBIwRemvkBY8uAD8ZtK4CYfvsQv4Uv4+qQOSK8MhBR8IXyBsOSxB8I3lcAlfvWB6jp8iV/il/D1x0BMwRfCFwhHHnsgfFMKXMI3ToSvE+qA9Eodj54ZCCn4QvgCYcmDD8mFb7KBS/jGi/B1QB2QnqkD0isDIQVfWO4MhCUPPkQbvwQu4ZtM/DL1dUAdj56pA9IzAzEFPwhfICx57MF9+BK4FZAHaV0MRCrhmzB1QHqljkfPDMQUfCF8gXDksQc34UvgBiQP0roYiFTCN2HqgPRMHZBeGQgp+MLUFwhLHnwwFb8EroA8SOtiIFJdx686HL1Tx6Nn6oD0ykBIwRfCFwhLHnuQhC+BKyAPz7oYCFECN2HqSPRMHYpeGQgm+ELgAmHJow4ELgxEaV0MRKrb8CV+iV/C1x8DMQVfCF8gHHnsIWj4ErjOyUO1Lgbi1XUUq4PSO3VYeqYOS68MBBZ8YRoMhCUPQZSO4vKB+748qIYZCDwkHr5/qQ9U1+FL/BK+hK8/BmIKfhC+QFjy2MMJ4Ttb4G7GQOQh8fg1EKmEb8LUAemVOh49MxBT8IXwBcKRx17CSgfuoTxaRyF84yEP0roYiFTCN2HqgPRMHZBeGQgp+MLUFwhLHYCxmzlwCd/4yYO0LgYi1XX8qsPRO3U8eqYOSK8MhBR8IXyBsNRhGItggVtZ+BK/psmjtC4GItVt+BK/xC/h64+BmIIvhC8QjjoYvak9cJn6pkEepHUxEKmEb8LUAemVOh49MxBS8IXwBcJSx6RFpgKX8I2fPEjrYiBSXcevOhy9UwekZ+qA9MpASMEXljsDYakjk8AlfJMnD9I6GYhUt+FL/BK+hK8/BmIKfhC+QFjq+CRwiV/UFZ0WGIjU/7+9e/u1tbzqOO6/oLUH2kKhBVprsdJqtKZaJYUGLFBaBZqwMdjrRo0Nihc1VRONqdZD4gFphLo57fXuA8Z4Z2Jqe6FeWi+MPaUXTZpKKQXKKWW7JsxJJ2uvuXjn+7xz/H5jPN+LbzbsFfbmcnzyjOd5gW/HqQGZNTUeM2eAKcoV8CXaXWqUAlzgS1HodMgAqcC349SAzJwakFkzgBTlCvgS7TY1WAEu8O0+OUijMkBqavyq4Zg9NR4zpwZk1gwgRbli3Zlot6khC3Cj4At+rZOjNCoDpKaFL/gFv8A3XwaYolwBX6LdBXATB3zrJAdpVAZIBb4dpwZk1tR4zJwBpChXwJdot3kB9/g+6sZmgE/HAHGd5FCNzACwoLjT1LDMnBqWmTNAFuWJNWii3eYDXOALfjtODtKoDJAKfDtODcisqfGYOQNMUa6AL9Hu8gEu8AW+HScHaVQGSAW+HacGZObUgMyaAaQoV8CXaLd5ABf8At+Ok4M0KgOkpsavGo7ZU+Mxc2pAZs0AUpQr1p2J5skfuMB3t/AFv9bJURqVAVLTwhf8gl/gmy8DTFGugC/R+PICF/juHr8GwCPgWzHgmyQ1ILOmxmPmDCBFuQK+ROcGcDsK4NZJDs+oDDAKcDtODcWsqZGYOQMwUa4ALtG5jQbuGTVcwS/wJeC7ygCpqfGrhmP21IDMnBqQWTOAFOWK+7zUc1sBd1NyuAJf4EvAd5UBUtPCF/wCX+CbLwNMUZ6AL/XQLMAti18DZLoGfuskB2lUBkgFvh2nBmTW1HjMnAGmKFfAl6q0c+AC374CvnWSgzQqA6QC345TAzJzakBmzQBSlCvgS9mSAbckfMEv8O0gOUijMkBqavyq4Zg9NR4zpwZk1gwgRbli3ZlcswNuWfwaINMxvttbKzlKozJAalr4gl/wC3zzZYApyhXwJWWpgAt8+wr41kkO0qgMkAp8O04NyKyp8Zg5A0hRroAvRVQCuCXhC36BbwfJQRqVAVKBb8epAZk5NSCzZgApyhXrzjRnpYHbHYoN8OkaKK6THKtRGQAWFHecGpZZU8MycwbIolwBYgK4wJeAb+nkII3KAKnAt+PUgMycGpBZM4AU5Qr4EsDtGb7gF/h2kBykURkgNTV+1XDMnhqPmVMDMmsGkKJcsQbdTwAX/ALfXcIX/NomB2lkBkhNC1/wC36Bb74MMEW5Ar61AriC5HhtyQCZrgHfOslBGpUBUoFvx6kBmTU1HjNnACnKFfDNGcA1So7X1gyQ6RjwrZMcpFEZIBX4dpwakJlTAzJrBpCiXLHu7B3ATZAcrq0ZINMx4FsnOUgjM4Aq+O00NR4zpwZk5gwwRXkCvh4B3OTJ8dqSATJdA791koM0KgOkAt+OUwMya2o8Zs4AU5Qr4AtwqTE5XlsyAKZrwLdOcpBGZYBU4NtxakBmTg3IrBlAinIFfAEuNSbHa2sGyHQM+NZJDtKoDJCaGr9qOGZPjcfMqQGZNQNIUa5Ydwa4NENyvLZkgEzH+KxRneQgjcwAqWnhC37BL/DNlwGmKFfAdybgnr73sbPnZIAyAr7ANwi/BsijzvFrgFTg23FqQGZNjcfMGUCKcgV85wDupo6D3x6S47UlA2C6BnzrJAdpVAZIBb4dpwZk5tSAzJoBpChXva077wa4wLfr5HhtzQCZjgHfOslBGpkBVMFvp6nxmDk1IDNngCnKU1X4xgL3ZfCrhhmBX+AbAF/wa50cpFEZIBX4dpwakFlT4zFzBpiiXGWGrw9wgW/XyfHakgEyXQO+dZKDNCoDpALfjlMDMnNqQGbNAFKUqwzw9Qcu685dJ8drawbIdAz41kkO0qgMkJoav2o4Zk+Nx8ypAZk1A0hRrpzWnfMCl1Pf7pPjtSUDZDrGunOd5CCNzACpaeELfsEv8M2XAaYoV9HwrQlc4Nt1cry2ZIBM14BvneQgjcoAqcC349SAzJoaj5kzgBTlalfw7Qu4R8AX/NZPjteWDIDpGvCtkxykURkgFfh2nBqQmVMDMmsGkKJcta47A1zg231yvLZmgEzHgG+d5CCNzACqafGrhmP21HjMnBqQmTPAFOVpLHwBbgN+1TAj8At8A+ALfq2TgzQqA6SmhS/4Bb/AN18GmKJcAVzgS43J8dqSATJdA751koM0KgOkAt+OUwMyc2pAZs0AUuQfwA2EL/itnxyvrRkg0zHgWyc5SKMyQGpq/KrhmD01HjOnBmTWDFBFPgFchwxgRuAX+AbAF/zaJgdpZAZITQtf8At+gW++DMBFsY0H7n37EDuYGobVM0AZAV/gG4RfA+RR5/g1QCrw7Tg1ILOmxmPmDCBGu6kNuJtSw7B6x8FvD8nx2pIBMF0DvnWSgzQqA6QC345TAzJzakBmzQBo1NZugAt8gS8B300ZINMx4FsnOUgjM4BqWvyq4Zg9NR4zpwZk5gzwRi9fLHDBrxS/apgR+AW+AfAFv9bJQRqVAVLTwhf8gl/gmy8D1NH3Gw3cU7sGLiD26jgo7iE5alszAKhjgLhOcqhGZYDX1ChWgzJ7alhmTg3LrBkgsHJbAXdTcuyC33D8qmFGwBf4BsAX/NomB2lkBkhNC1/wC36Bb74MgJi9WYCbBr9qGFbPAGYEfoFvEH4NkEed49cAqcC349SAzJoaj5kzgGOWdg5c4EusO/eRHK8tGQDTNeBbJzlIozJAKvDtODUgM6cGZNYMQOmWDLjAl4BvH8nx2poBMh0DvnWSgzQyA6imxa8ajtlT4zFzakBmzgCbADcLfMFvCH7VMCPwC3wD4At+rZODNCoDpKaFL/gFv8A3XwYIBbiZ8KuGYfUMUEbAF/gG4dcAeAR8KwZ8k6QGZObUgMyaAU4BLvClNfiC3/rJ8dqaATIdA751koM0KgOkpsavGo7ZU+Mxc2pAZs0ArQAX4PbXcYDbQ3KgtmaASccAbp3k8IzKAKIAt+PUSMycGopZM0ArwM0EX/Abgl81zAj4At8A+IJf2+QgjcwAqWnhC37BL/DNlwFopwP3/n0crjJAahf4VcOwegYwI/ALfIPwa4A86hy/BkgFvh2nBmTW1HjMXDrgHpUBUoEvtcIX/NZPjteWDIDpGvCtkxykURkgFfh2nBqQmVMDMmspgQt8gW/VjgPfHpLjtTUDZDoGfOskB2lkBlBNi181HLOnxmPm1IDMXDrgAl/wWzkDmBH4Bb4B8AW/1slBGpUBUtPCF/yCX+Cbr3TABb/At3IGKCPgC3yD8GsAPAK+FQO+SVIDMnNqQGYtJXABsR+IQTEopr5BfFwPT9c4Da6THKqRGQAWFHecGpZZU8PSvFrA7Qy+dvhVw7B6BjAj8At8g/BrgDzqHL8GSAW+HacGZNYMcOlQH8DtEL9y7AJf4EvAd5UBMF0DvnWSgzQqA6QC345TAzJzBvAEuOoMkAp8qRW+4Ld+cry2ZoBMx4BvneQgjcwAqmnxq4Zj9tR4zJwBSAGuOgOklocv+A3BrxpmBH6BbwB8wa91cpBGZYDUtPAFv+AX+AJc8Fscv2oYVs8AZQR8gW8Qfg2AR8C3YsA3SWpAZs4AsbMA9+Q+4FbJIZktA6QCX2qFL/itnxyvrRkg0zHgWyc5SKMyQGpq/KrhmD01HjNngNvJwN2UHJLZMkBqefiC3xD8qmFGwBf4BsAX/NomB2lkBkhNC1/wC347ge+swAW/M2WA1C7wq4Zh9QxgRuAX+Abh1wB51Dl+DZAKfDtODcisyYH7wD5U12sEL/CdmAFSgS8BXwK+fQZ86yQHaVQGSAW+HacGZOYkwD0q4At8gS9NgC/4rZ8cr60ZINMx4FsnOUgjM4BqWvyq4Zg9NR4zJwMu8PXJAKnl4Qt+Q/CrhhmBX+AbAF/wa50cpFEZIDUtfMEv+DWAbyxwdwhf8DshA6iWx68ahtUzQBkBX+AbhF8D4BHwrRjwTZIakInyAC7w9coAqcCXWuELfusnx2trBsh0DPjWSQ7SqAyQmhq/ajhmzwCUbnkDFxTnyACvoJjmQLEabASKATEo7j05VqMywGtaEINiUNwdcGeCrxyNVTJAahngAt+dd+awDFBGABf4zgxc4GubHJ7qDJCaArjAF/gCXE52Ae68yVELcOMyQBkBX4AbBF8D4FHn8DVAamr4qoGYPQOcAlwj/MohmS0DpAJfaoUv+K2fHK+tGSDTMeBbJzlIIzOAalr8quGYPQO0AlzgmzcDpJaHL/gNwa8aZgR+gW8AfMGvdXKQRmWA1LTwBb8l8QtwRfAFvxMygGp5/KphWD0DlBHwBb5B+DUAHgHfigHfJAHcIgFf4At8aSJ8wW/95HhtzQCZjgHfOslBGpUBUlPjVw3H7AHcQgFf4FsRvuA3BL9qmBHwBb7At+fkII3MAKlp4Qt+bfALcNXNAF/wu2UGSO0Cv2oYVs8AZgR+gS/47T05SKMyQCrw7TiAWyTgC36BLwFf2pAcry0ZANM14FsnOUijMkAq8O24ZuA+uA+mBw3gR8AX+AJfmgRf8Fs/OV5bM0CmY8C3TnKQRmYA1bT4VcMxedsD96jU8Os94At8K8IX/IbgVw0zAr/ANwC+4Nc6OUijMkBqWviCXwFwga9nM8AX/E7IAKrl8auGYfUMUEbAF/gG4dcAeAR8KwZ8qwIX+HoGfIEv8KWJ8AW/9ZPjtTUDZDoGfOskB2lUBkhNjV8DcNoCd9gH6aqdYBf4egV8gW9F+ILfEPyqYUbAF/gC356TgzQyA6SmhW9h/E4C7pRAcfFmADEonpABYMujWA3G6hmAjUAxIAbFvSeHalQGeAXEhYALfDsO+AJf4EsT4At+6yfHa2sGyHQM+NZJDtLIDKCaFr8GqLUCrgy+4Fcf8AW+FeELfkPwq4YZgV/gGwBf8GudHKRRGSA1LXxF+LUFLqe+HTcDfMHvhAygWh6/ahhWzwBlBHyBbxB+DYBHwLdiFeCbErjAt9OAL/AFvjQRvuC3fnK8tmaATMeAb53kII3KAKmp8QtwgS89Nht+5ZDMlgFSgS/NgV81zAj4Al/g23NykEZmgNS08N0Cv10AVwZf8KtvBviC3y0zQCr4JeBL5fFrgEzXwG+d5CCNygCpleDbNXA59e044At+gS8BX9qQHK8tGQDTNeBbJzlIozJAakb4AlzgS8BXnwFSgS+1whf81k+O19YMkOkY8K2THKSRGUDVFb8ANwt8wa8+4At8K8IX/IbgVw0zAr/ANwC+4Nc6OUijMkCqGr4AF+ASwPXNAKMAlwAuAdw+A7i1ksMzKgOM5gHuCT0iswZ8izcDfMHvhAygWh6/ahhWzwBlBHyBbxB+DYBHwLdi7cA9KgNIZgv4Fg/4Al/gSxPhC37rJ8drawbIdAz41kkO0qgMkDp38wEX+AJfCsWvHJLZMkAq8KU58KuGGQFf4At8e04O0sgMsOoJXEAMiskCxKB4QgaABcUEiKk0ig3w6RoorpMcqlEZ4NYTuOAX+BLwdc8AqcCXWuELfusnx2trBsh0DPjWSQ7SyAAu8E0PX/CrD/gC34rwBb8h+FXDjMAv8A2AL/i1Tg7SqAAu8C2BXzX8em8G+ILfCRlAtTx+1TCsngHKCPgC3yD8GgCPgC/ABb/Al4BvxgyQCnypFb7gt35yvLZmgEzHgG+d5CCNCuBOyACS2QK+HQR8gS/wpYn4VcOMgC/wBb49JwdpZAB3ywwgmS3u+XbQDPAFv1tmgFTwS8CXyuPXAJmugd86yUG6o0YDd08NTNcMIJkx4Fs84At+gS8BX9qQHK8tGQDTNeBbJzVQQ4F7VHJoOmYAyWwB3+IBX+ALfGkifMFv/eR4bc0AmY4B3zqp4RoOXOC7RQaQzBbrzh0EfIFvRfiC3xD8qmFG4Bf4BsAX/FqnRm0ocIHvFhlAMlvAt4NmgC/4nZABVMvjVw3D6hmgjIAv8A3CrwHwyAe+MuAC3y0zwGS2gG/xgC/wBb40Eb7gt35yvLZmgEzHgG+dugIu+N0yA0hmC/h2EPAFvsCXJuJXDTMCvsAX+PZcLHD39MAFvltkAMlsse7cQTPAF/xumQFSwS8BXyqPXwNkugZ+67Qb4G7KALnAd2QGkMwY8C0e8AW/wJeAL21IjteWDIDpGvCt026AOyUDAIPikRkAM1ucBncQIAbEFUEMikExgWIDfDrGq8950gEX+ObPAJLZAr4dNAN8we+EDKBaHr9qGFbPAGUEfIFvEH4NEFg5P+Amw68cma4ZYDJbwLd4wBf4Al+aCF/wWz85XlszQKZjwBfgAtxKGYAxWwC3eAAX4AJcAri0ITlQWzPApGMAF+CWgi/43ZABJLMFfDsI+AJf4EsT8auGGQFf4At83aoBXOCbPwNIZov7vB00A3zB75YZIBX8EvCl8vg1QKZr4BfgAt/qGUAyY8C3eMAX/AJfAr60ITleWzIApmvAF+CC3x4ygGS2gG/xgC/wBb40Eb7gt35yvLZmgEzHgC/ABb49ZADJbLHu3EHAF/hWhC/4DcGvGmYEfoFvAHwL4RfgAt9+MoBktoBvB80AX/C7ZQZI7QK/ahhWzwBlBHyBbxB+DdAKcF0ygC7wHZkBJrMFfIsHfMEv8KWJ8AW/9ZPjtTUDZDpWBb4AF/iCX+ALfCkcv3JIZssAqcCX5sCvGmYEfIFvffgCXKcMkAt8R2YAyWyx7txBwBf4gl8CvrQhOV5bMkCma474BbgZMkAu8B2ZASQzBnyLNwN8we+EDJAKfAn4EvDtMyV8AW72DKALfkdmAMlsAd/iAV/gC3xpInzBb/3keG3NAJmORcAX4PaWAX4B8cgMgJkt1qA7CBQDYlBME1GsBhuBYkAcg2KAS9b4lSPTNQNMZgv4Fg/4gl/gSxPhC37rJ8drawbIdAzgUin4gt8NGUAyW8C3g4Av8AW+BHzpkORwbc0AmY4BXJqeAXKB78gMIJkt1p07CPgCX/BLE/GrhhmBX+ALcCkyA+QC35EZQDJjwLd4M8AX/E7IAKnAl4AvAd/8AVyKzQC64HdkBpDMFvAtHvAFvsCXJsIX/NZPjtfWDGAKcKlWBsgFviMzgGS2WHfuIOALfCvCF/yG4FcNMwK/1eALcMk7A+QC35EZQDJbwLeDZoAv+N0yA6R2gV81DKtngDICvlnhC3ApbwbQBb4jM8BktoBv8YAv+AW+NBG+4Ld+cry2BnCJZs4AuuB3ZAaQzBbw7SDgC3yBLwFfOiQ5XFsDuEQzZ4Bc4DsyA0hmi3XnDgK+wBf80kT8qmFG4DcSvgCXCODmyQCSroUAF/h6BnDBb3bgAt+dd+awDFBGAHcX8AW4RGLgAt8tMoBkxgBu8bYALvgFuKngawDD0hmgjIAvwCWKzgC64HdkBpDMFvAtHvAFvsCXJsIX/NZPjtfWAC5RUAb4BcQjMwBmtlh37iBQDIhBMU1EsRpsBIpXAVyiqAygC3xHZoDJbAHf4gFf8At8aSJ8wW/91KAFuERuGUAX/I7MAJLZAr4dBHyBL/Al4EuHBHCJ6KUZIBf4jswAktli3bmDgC/wBb80Eb9qmFFu/AJcomwZIBf4jswAkhkDvsWbAb7gd0IGSAW+BHwpAr4Al6hSBtAFvyMzgGS2gG/xgC/wBb40Eb7gt34Al4hemgFyge/IDCCZLdadOwj4At+K8AW/IfhVw4zi8QtwiXrOALnAd2QGkMwW8O2gGeALfrfMAKld4FcNw+oZoIx2F8AlosMzgC7wHZkBJrMFfIsHfMEv8KWJ8AW/+QO4RLRdBtAFvyMzgGS2gG8HAV/gC3wJ+JYO4BLRPBkgF/iOzACS2WLduYOAL/CtCF/wG4JfNegI4BJRZAbIBb4jM4BkxoBv8WaAL/idkAFUy+NXDcPqGUCv1wAuEekygC74HZkBJLMFfIsHfIEv8KWJ8AW/AJeIessAucB3ZAaQzBbrzh0EfIFvRfiC3xD8qnFYIYBLRHkyQC7wHZkBJLMFfDtoBviC3y0zQGoX+FXDsHoGaMwUwCWi2hkAGBSPzACZ2QLEHQSIQTEgpgkg7hnFAJeI+swAucB3ZAaQzBanwR0EfIFvRfiC3xD8qgEKcImIIjNALvAdmQEkMwZ8izcDfMHvhAygWh6/ahhWzwCmAJeIKDoD6ILfkRlAMlvAt3jAF/gCX5oI32z4BbhERK0ZIBf4jswAktli3bmDgC/wrQhf8BuCXzVmAS4R0S4ywCzAHZkBGLMFcDsI4AJcgEsAl4iIXjYD5ALfkRlAMlvAt4NmgC/43TIDpHaBXzUMqwdwiYg6zAC6wHdkBpjMFvAtHvAFv8CXJsI3Ar8Al4jIKQPogt+RGUAyW8C3g4Av8AW+JIYvwCUiypABcoHvyAwgmS3WnTsI+ALfivAFvyH4BbhERD1lgFzgOzIDSGYM+BZvBviC3wkZQLU8ftUwrB7AJSLqMAPogt+RGUAyW8C3eMAX+AJfmghfgEtE1FsGyAW+IzOAZLZYd+4g4At8K8IX/M4WwCUiohcyQC7wHZkBJLMFfDtoBviC3y0zQGoX+DVAY6bGA3fYHzTGpB7QiIgoLgMAg+KRGSAzW4C4gwAxKAbE5ZofuMCXiIgMkAt8R2YAyWxxGtxBwBf4VoRvJ/iNAy74JSIiA+QC35EZQDJjwLd4M8AX/E7IAKrl8WsA01rABb5ERGQAXfA7MgNIZgv4Fg/4Al/ga5M3cIEvEREZIBf4jswAktli3bmDgC/wrQhfY/zmBC74JSIiA+QC35EZQDJbwLeDZoAv+N0yA6R2gV+AG5R6ECMiopgMkAt8t8gAk9kCvsUDvuAX+AJc4EtERKMygC74HZkBJLMFfDsI+AJf4AtwgS8REb1sBsgFviMzgGS2WHfuIOALfCvCdyJ+AS74JSKiTRkgF/iOzACSGQO+xZsBvuB3QgZQLY9fgBuUehAjIqK4DKALfkdmAMlsAd/iAV/gWxi+ABf4EhHRnBkgF/iOzACS2WLduYOAL/BNDl+Aq049iBERUUwGyAW+IzOAZLaAbwfNAF/wu2UGSM2IX4DrmnoQIyKimAyQC3xHZgDJjAHf4gFf8GsGX4DrmnrgIiKimAwwC3BHZoDFjAHc4gFcgAtwCRATEVFTBgAGxSMzAGa2WHfuIEAMiHcIYoDbQ+pBjIiIYjJALvAdmQEkMwZ8izcDfMHvhAygOmcAt+fUgxgREcVlAF3wOzIDSGYL+BYP+AJfgEvAl4iIRmWAXOA7MgNIZot15w4CvsAX4FJT6kGMiIhiMkAu8B2ZASSzBXw7aAb4gt+c8AW4NE/qQYyIiGIyQC7wHZkBJDMGfIsHfMvjF+DSblMPYkREFJcBdMHvyAwgmS3g20HAtwR8AS5pUg9hREQUlwFyge/IDCCZLdadOwj4poLvaOCe2EfJenIgUd3UgxgREcVkgFzgOzIDSGYM+BZvBviC3/nxOxm4RyUHEtVMPYgREVFcBtAFvyMzgGS2gG/xgK8UvuOBe3I8cIEvhaYewoiIKC4D5ALfkRlAMlvAt4OA787bDribGoAvmaYexIiIKCYD5ALfkRlAMlvc8+2gGeALfucE7o7gC35pZ6kHMSIiiskAucB3ZAaQzBjwLR7wNQMup76ULfUgRkREcRlAF/yOzACS2QK+HQR8RwH3rWHA3RGI5UCi/lIPaEREFBPwzZMBMF0LWXcGxZ51At88wGUNmrKlHsSIiCguMX5B8RYZIDNbwLd4M5wEO6E4P3BZg6ZsqYcwIiKKywC5wHdkBpDMFvDtoITwrQ1c4EvZUg9iREQUkwFyge/IDCCZLdadO8j41LdP4O4IvuCXdpZ6ECMiopgMkAt8R2YAyYwB3+IZwHcscH9Sjk91A/Alw9SDGBERxWUAXfA7MgNIZgv4dlAQfBd2BbjAl6qlHsKIiCguA+QC35EZQDJbrDt30MzwBbhi+MohRP2lHsSIiCgmgJsnA0i6FgJc4OsZwDVraEuOIKqbeuAiIqKYxMAFvltkAMmMAdziTTzNPQq4b18C950A1we+4Jd2lnoQIyKiuAygC35HZgDJbAHf4o0D7jsBrkMD8CXD1EMYERHFZYBc4DsyA0hmC/h20AjgXg5wDRqAL5mmHsSIiCgmA+QC35EZQDJb3Oet1RpwL18H7mUAN0ED8CXT1IMYERHFZIBc4DsyA0hmDPjmC+BWbQC/ZJh6ECMiorgMoAt+R2YAyWwBX98Abm8NbcmBRDVTD2FERBSXAXKB78gMIJkt1p31HQTuj+z3oweA+w6A23FDe3I8Uc3UAxoREcVlAGBQPDIDZGYLEO8EuO/YBNwXv4Urhxb5NbQlBxLVTD2EERFRXAbIBb4jM4BktoDvZOD+xNKwP74O3LcBXJrc0JYcSFQ39SBGREQxGSAX+I7MAJLZYg16OnB/DODSrA1tyXFEdVMPYkREFJMBcoHvyAwgmTHgezhw3wpwKbyhLTmQqGbqQYyIiOIygC74HZkBJLPVE3wPAvctB4D79uUP3ykHEPXZ0JYcSFQz9RBGRERxGSAX+I7MAJLZqrjuvHxBeWHYtx8E7ks+FSSHDtF6Q1tyIFHd1IMYERHFZIBc4DsyA0hmLCt8V58IWgfuYZ8KAriUo6E9OZCoZupBjIiI4jKALvgdmQEks+UO3zHAff4erhwuRK0NbcmBRDVTD2FERBSXAXKB78gMIJktF/iu7t+ugPvmTS8py3FCtKuGtuRAorqpBzEiIorJALnAd2QGkMxW9D3fNeD+2Dpwz3lJWY4QouiGtuQ4orqpBzEiIorJALnAd2QGkMzYLrB7GHAPe0n5cjk2iJwa2pIDiWqmHsSIiCguA+iC35EZQDJbjcC9fGnY54F76aaXlOWgIMrQ0JYcSFQz9RBGRERxGSAX+I7MAJLZ2hK4l60D95yHpuRwIMrc0JYcSFQ39SBGREQxGSAX+I7MAJIZWwPujx8E7qEPTcmBQFSxoT05kKhm6kGMiIjiMoAu+B2ZASTdW92/XVh2AdxLNjw09XY5BIh6a2hLDiSqmXoIIyKiuAyQC3xHZgBLl1b3b9eBe+g9XPmwT0QvNLQlBxLVTT2IERFRTAbIBb4jMwCnCLiXrYB78aZ7uPKhnoiObmhLjiOqm3oQIyKimAyQC3xHZgDRAOD+6Dpwz7mHKx/eiWh6Q1tyIFHN1IMYERHFZQBd8NsHflfrySvgvmnDPdzL5AM6Ec3f0JYcSFQz9RBGRERxGSAX+NaC72o9eWHZdeCes6YsH8SJKK6hLTmQqG7qQYyIiGIyQC7wzQnf1XrywrIr4B66piwfuIlI39CeHEhUM/UgRkREcRlAF/za4ve51XryCrhvXAL3nDXl/eH2OflwTUS+DW3JgUQ1Uw9hREQUlwFyga8WvnsPPPbUaj15HbiHrik/ODz6qHyAJqJ8DW3JgUR1Uw9iREQUkwFygW8MfPfuf/T/Vqe3C8sugHvRhjXlt963939flg/KRFSnoS05jqhu6kGMiIhiMkAu8J0Xvifuffgrq9PbhWVXwD24prw4xX3rP9z/jc/LB2Iiqt/QnhxIVDP1IEZERHEZQBf8bo/f+z7zjc8vgfuWFXAv3LSm/Ol7vnJcPvgSUd8NbcmBRDVTD2FERBSXAXKB7+bu/vRXjq/WkxeWXQD3DZvWlP/sL//jY/LhlojosIa25ECiuqkHMSIiiskAucD3sbN/8ef/+bHVevI6cA89xb3l2O0/Jx9iiYi2aWhPDiSqmXoQIyKiuAyg2wt8bz322z+3Or1dWHYF3BVy37Ts0tVJ7v173/6SfGAlItplQ1tyOFHd1AMaERHFZADgjCjeu//bX1qd3C570wK4568B95xV5bvu+eqnTpx8XD+AEhFFN7QlxxHVTT2IERFRTAbI9YXv42fvueurn1oD7sUr4L5+vwvW7uK+ZFX52K13XAFwiYjWGtqTA4lqph7EiIgoLgPoavH7+HO3HrvjitVq8tKwb1wB96hT3EseHL7zr/KBkogoQ0NbciBRzdRDGBERxWWA3BD4PvjYv669H3Xx0rAXLYD7ugOnuAcfnLrkNz721zfunX5SPzgSEWVtaEsOJKqbehAjIqKYDJA7F3xP7T159jd/469vXHl1dXq7sOw6cFenuAc/G3TJu971s5fcd+Jb/7x3ilVlIqJZG9qTA4lqph7EiIgoLgPojoXvyb3Hzz5437f+eWHUJW5fPL1dWHYB3Ne+zCnu4j+4+JZjv3XV3uknH5EPg0REvTS0JQcS1Uw9hBERUVwG0D3Yyb0nHzl2y29dtXLq+untCrjnLZF72CnuCrmXvuMd77zok5/63Mf3zjz1PfnQR0TUc0NbciBR3dSDGBERxSTC7am9J7/3J5/83O8ubLr6LNDSrBetHHsQuEc9OHXJ1dfc/CN//5mvDcNDTz8nH/CIiOilDW3JcUR1Uw9iREQU0w5xe3p4+rl7/v5rw9VX3/yWQ1aTL1wa9vx14L5ubVX5UOAu/vnGmz76U/eeePjf95GrH+aIiOj7DW3JEUR1Uw9cREQU0+5we/aBex/+95tu/OhPrz2GfBhwX78A7muWyD1vw13cCw8g9/xjt97xvvv2HvnCyX98Vj/QERHR0Q3tyYFENVMPYkREFNdE3J45+ezZB+975L+PHbvjfctt43XcXriG2wtWwH3VIcA9fw25bzjw4NTiD3z1bR/5+A33nnj4vxbI3Tv1hH6AIyKi7RvakgOJaqYewoiIKK4NsB32nngetw/c+/B//eptH//gwqAHcPvGNa9esDTsi8BdneK+dgNy1x+cetPyQu8P3/orv3P9Pce//tl95H5v7wzfySUiKtPQlhxIVDf1IEZERDvv5PDk2TOnnv3e8c98/XO/cuvvXL+w59qjUgcflnoRtwvLroC7jtz1k9zVuvKFB5B78fIveMVNH/719/zVnV+4e+/MU9994TSXb+USEZVtaE8OJKqZwUBGRERtDXuPL2B79tTw1Hf/9m++cPeHb/71n1+Yc2nPiw/g9sLVWvIKtwvL/sBSwy+H3DccgdxXXX/9bW/+xB/80x337337y8NDz549+Y/PAF0iot4a2pIDiWpmMLAREdHRvQDbZ86eXty3feDbX/793/unO66/7rY371vzlUfg9g0HcXsYcNfv4553+Us/HXTBBugu/sLz3/Oe973m5g//2vV33vU/9+ydfuI7w0PPnF28tMz9XCIiOrShLTmcqG4Gwx4RUQ8t7tmePvn0fs+cPbn3xHf+7s7/uefmm3/t+oUtlwY9+K3b9Qelzl/z6nnrwH3FErmvXAL31UfcyV1d4r3wwJ3c1WXfH37/tbe87ZZjt99856f/9+4Tpx7/1t4CuWeeeqHnT3U52SUioiMa2pMDiWpmMAwSEeXu8edPa08NTy17evHv37rrzv+9+9gtt9/8/vff8ralTV/8TO0acC9c8+iLd26XZj1vadhXr4C7DXI3neSu/icWP3/V1VffeNkHbvjItZ/81Oc/cfyBb/7bPnCffgG6T57dO73ou2u/EhERLTtFZNpJam3orYF66eR6e3R4Tz7/eNQSt0/ff/yb//anf/L5T9zwgY9cu7Dj0qEXXH7uS8mbTm7Pwe3iz1gA94e2RO7q4amDLyyvoHvJ8ih58fuv/YVfuOaSq6+56WeuvfbW6/7wj//l9rvu/uLd++D97InhsS/tDzKPnnzomecWj1MRERFN7qFxnSKK7gytd5pevtNUqTNjOlWz04vHok4+/eyw98Qje3uPfen+e7/52U/f9cW7/+iP/uX2a6+79bprrr7pZxZWXFrzoqUhV6e2K1+uv5R88EGpc3C7sOwCuD84Erkr6I65l7sO3YuXP7/g3T97xaVXXPGLl7/3vde968orb/j5K6/84FVXXvWha6666kPvX3btsuv2u/6QPrDshrU+uNaHDvRLW/TLRERERERERdrGQgcdtW6sdXutPHaY1RaGW3luYbtfvOrKD129b74rF/ZbGHBhwXe/+4pLL//+l3pWDxcfXEc+6r7tCrbn4HZh2f8H3p8MFTA8APQAAAAASUVORK5CYII='}}
            />
            <TouchableNativeFeedback
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
                this.selectimage();
              }}>
              <View style={[styles.button1, {width: '90%'}]}>
                <Text style={styles.buttonText}>
                  Select From Gallery
                </Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
                this.captureimage();
              }}>
              <View style={[styles.button1, {width: '90%'}]}>
                <Text style={styles.buttonText}>
                  Take A Photo
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <TouchableNativeFeedback
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
                
              }}>
              <View style={[styles.buttonclose1, {width: '40%'}]}>
                <Text style={styles.buttonText}>
                  Close
                </Text>
              </View>
            </TouchableNativeFeedback>
        </Modal>
      </View>
    )
  }

  submit() {
    let data = {
      email: this.state.email.value,
      name: this.state.name.value,
      gender: this.state.gender,
      date: this.state.date
    };


    if (!data.email || !data.name) {
      this.setState({name: this.verifyName(data.name)});
      this.setState({email: this.verifyEmail(data.email)});
      return;
    }

    this.props.userDataUpdate(data);
    this.props.goTo([0, 2])
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  userDataUpdate: userDataUpdate,
  goTo: goTo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Fields)