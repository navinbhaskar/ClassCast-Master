import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {goTo} from "../../Redux/Navigation/NavigationActions";
import {userDataUpdate} from "../../Redux/User/UserActions";
import styles from "./LoginStyles";

const vw = Dimensions.get('window').width / 100;

const homePlace = {
  description: 'Home',
  geometry: {
    location: {
      lat: 48.8152937,
      lng: 2.4597668
    }
  }
};


class Location extends Component<{}> {
  getLocation = () => {
    navigator.geolocation.getCurrentPosition(locationData => {
        let {latitude, longitude} = locationData.coords;
        this.setState({
          currentLocation: {
            description: 'Current Location',
            geometry: {
              location: {
                lat: latitude,
                lng: longitude
              }
            }
          }
        });
      }, error => {
        this.setState({enableHighAccuracy: false}, () => this.getLocation())
      },
      {enableHighAccuracy: this.state.enableHighAccuracy, timeout: 10000})
  };

  constructor() {
    super();
    this.state = {
      currentLocation: null,
      enableHighAccuracy: true,
    }
  }

  componentDidMount() {
    this.requestLocationPermission();
  }

  render() {
    return (
      <KeyboardAvoidingView style={[styles.container, {justifyContent: 'flex-start'}]} behavior="padding" enabled>
        <Image
          style={styles.locationIcon}
          source={{uri: 'http://unsplash.it/600'}}
        />
        <Text style={styles.locationTitle}>Your Location</Text>
        <View style={styles.locationTextInputContainer}>
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2}
            // autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed='true'
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(data, details);
            }}
            query={{
              key: 'AIzaSyAV4FNxS40-VGVm_TSjvhZIYYMJdgpDbb8',
              language: 'en',
              types: '(cities)',
              components: 'country:in',
            }}
            styles={{
              textInputContainer: styles.locationInputWrapper,
              textInput: styles.locationTextInput,
              predefinedPlacesDescription: {
                color: '#1faadb'
              }
            }}
            predefinedPlaces={this.state.currentLocation ? [this.state.currentLocation] : []}
            debounce={200}
            // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
            // renderRightButton={() => <Text>Done</Text>}
          />
        </View>
        <TouchableNativeFeedback
          onPress={() => this.props.goTo([0, 5])}
        >
          <View style={[styles.nextPage, {left: 45.5 * vw}]}>
            <Image
              style={styles.nextPageIcon}
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAANAklEQVR4Xu2dTcju+RiAr2HOaMIKB0WRfGTlSCxJ8hFl8q1paDZqzBFDsSExFCmmGMZGDJHJUJSPhRVlIcVuLCwYFjPbYTKSox/PMa/3fc95/x+/7/t6albz/9+/+77u+77O85zn41yDDwlIICyBa8JWbuESkAAKwCGQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzLV0CCsAZkEBgAgogcPMtXQIKwBmQQGACCiBw8y1dAgrAGZBAYAIKIHDzC5R+PfBE4G+H/wocYcicBBRATprxYqX5eS1wI/By4BlHEDwI/BL4LvB94J/x8PRfsQLov0e9ZvhS4C7gwoIE/wBcBH664FovqUhAAVSEPdFR7wHuBK5dUdMl4NPAx1bc46WFCSiAwoAnDJ+W/6s76voS8L4d93trRgIKICPMAKHS0/70uv7czlqVwE6AuW5XALlIzh8nzcpvFr7mX0JDCSyhVPgaBVAY8EThXwf8OHM9SiAz0LXhFMBaYnGv/9bh7b7cBJRAbqIr4imAFbCCX3r/sff5c+JQAjlproilAFbACnxp+oTfw4XrVwKFAZ8WXgE0gD7gkeeBByrkrQQqQD56hAKoDHzQ4x4P/LVS7kqgEuh0jAKoCHvwo9IzgPRMoMZDCdSgrAAqUZ7jmHuBN1UsRQlUgO0zgAqQJznibYdv9tUsRwkUpq0ACgOeKHz64s99wHMq16QECgJXAAXhThg6fff/Jw3qUgKFoCuAQmAnDns78NEG9SmBAtAVQAGoAUJ+8fADH7VLVQKZiSuAzEADhUvLeGuDepVARugKICPMgKGUwOBNVwCDN7CD9JVAB03YmoIC2ErO+44SaCWB9LuE6cdGfWwkoAA2gvO2EwSUwIBDoQAGbFrHKSuBjptzWmoKYLCGDZCuEhigSZdTVAADNWugVJXAIM1SAIM0asA0lcAATVMAAzRp4BSVQOfNUwCdN2iC9JRAx01UAB03Z6LUlECnzVQAnTZmwrSUQIdNVQAdNmXilJRAZ81VAJ01JEA66eO7721Qpx8bPgW6AmgwiR6JEuhkCBRAJ40ImIYS6KDpCqCDJgROQQk0br4CaNwAj/flQMsZUAAt6Xv2ZQI+E2g0CwqgEXiPPUFACTQYCgXQALpHXpGAEqg8HAqgMnCPO5NAKwl8udGvHJ8JpOQFCqAkXWNvJaAEtpJbeZ8CWAnMy6sRUAIVUCuACpA9YjMBJbAZ3bIbFcAyTl7VjoASKMheARSEa+hsBJRANpT/H0gBFAJr2KwE0pymrxK3+Bbh1O8OKICsc2qwggSUQAG4CqAAVEMWI6AEMqNVAJmBGq44ASWQEbECyAjTUNUIKIFMqBVAJpCGqU5ACWRArgAyQDREMwJKYCd6BbAToLc3J6AEdrRAAeyA563dEFACG1uhADaC87buCCiBDS1RABugeUu3BJTAytYogJXAvLx7AkpgRYsUwApYXjoMgdYSuAhcGoGWAhihS+a4hYASWEBNASyA5CXDEkjznb5KfEuDCtK3CLt/JqAAGkyGR1YloASuglsBVJ1FD2tEQAlcAbwCaDSRHludgBI4BbkCqD6HHtiQgBI4Bl8BNJxGj25CQAkcwa4AmsyghzYmoAQODVAAjSfR45sRUAKAAmg2fx7cAYHwElAAHUyhKTQlEFoCCqDp7Hl4JwTCSkABdDKBptGcQEgJKIDmc2cCHREIJwEF0NH0mUoXBEJJoIUAngq8BngR8DTgui7abhISeJRA2ovXA49rAKXqtwhrCuCFwCeBG4DHNgDrkRIYhUA1CdQSwIeBTwHnRumAeUqgMYEqEqghgPTPOt/aGKbHS2BEAsX/afLSAkh/8n92RPLmLIFOCHwQ+EKpXEoKIL3m/61P+0u1zrhBCDwCPB/4Y4l6Swrge8CbSyRtTAkEI3A38O4SNZcSQHqr7y/+bX+JlhkzIIF/AE8GHspdeykBvAv4Ru5kjSeBwATeDtyTu/5SAvg8cFvuZI0ngcAEPgekv1TP+iglgG8D78yaqcEkEJvAN4H0zDrrQwFkxWkwCRQjMJQAfAlQbA4MHJTAUC8BbgLSWxc+JCCBPATeAtybJ9SjUUq9BDh/eBvw2twJG08CAQkM9zZg6lF6y+KtAZtlyRLITeDrwM25g6Z4pZ4BpNgvAH7n9/1LtM2YgQj8HXgecH+JmksKIOWbPguQ/kLQhwQksI1A+iZt+lZgkUdpAaSk0zeZPlAke4NKYG4C6Q/PD5UssYYAUv7vP3wtuMVPLJXkZ2wJlCJwR41P09YSQIL0XOATQHo7w18GKjU2xp2BQJXlT6BqCuByY54EvAq4ADy90Q8vzjAk1lCOQNqLNzaazWrL30oA5dpmZAnsJ9DyZ8GrLr8C2D8sRpiLQKjlVwBzDa/V7CMQbvkVwL6B8e55CIRcfgUwzwBbyXYCYZdfAWwfGu+cg0Do5VcAcwyxVWwjEH75FcC2wfGu8Qm4/Icetvgg0PjjYwUjE3D5j3RPAYw8yua+loDLf4yYAlg7Ql4/KgGX/5TOKYBRx9m81xBw+a9ASwGsGSOvHZGAy3+VrimAEUfanJcScPnPIKUAlo6S141GwOVf0DEFsACSlwxHwOVf2DIFsBCUlw1DwOVf0SoFsAKWl3ZPwOVf2SIFsBKYl3dLwOXf0BoFsAGat3RHwOXf2BIFsBGct3VDwOXf0QoFsAOetzYn4PLvbIEC2AnQ25sRcPkzoFcAGSAaojoBlz8TcgWQCaRhqhFw+TOiVgAZYRqqOAGXPzNiBZAZqOGKEXD5C6BVAAWgGjI7AZc/O9L/BlQAhcAaNhsBlz8bypOBFEBBuIbeTcDl343w6gEUQGHAht9MwOXfjG75jQpgOSuvrEfA5a/EWgFUAu0xiwm4/ItR7b9QAexnaIR8BFz+fCwXRVIAizB5UQUCLn8FyMePUAANoHvkCQIuf6OhUACNwHvs/wi4/A2HQQE0hO/R//kg2p3ALQ1Y3AHc1uDcro5UAF21I1QyLn8H7VYAHTQhYAoufydNVwCdNCJQGi5/R81WAB01I0AqLn9nTVYAnTVk4nRc/g6bqwA6bMqEKbn8nTZVAXTamInScvk7bqYC6Lg5E6Tm8nfeRAXQeYMGTs/lH6B5CmCAJg2Yoss/SNMUwCCNGihNl3+wZg2Urql2TsDl77xBx9PzGcBgDes4XZe/4+ZcKTUFMGDTOkzZ5e+wKUtSUgBLKHnN1Qi4/APPhwIYuHkdpO7yd9CEPSkogD30Yt/r8k/QfwUwQRMblODyN4Be4kgFUILq3DFd/on6qwAmamalUj4DfKTSWUeP8Tf8CkBXAAWgThzyDcCPGtTn8heCrgAKgZ0w7Dng98CzK9fm8hcErgAKwp0s9DuA71SuyeUvDFwBFAY8UfgfADdUrMflrwBbAVSAPMkRDwJPqVSLy18JtAKoBHrwY54APFSpBpe/Euh0jAKoCHvgo84DD1TI3+WvAPnoEQqgMvBBj7seeLhw7i5/YcCnhVcADaAPeuSfgGcWyt3lLwT2rLAK4CxC/v/LBO4GbiqAw+UvAHVpSAWwlJTXvRr4WWYMLn9moGvDKYC1xGJf/2vgJZkQuPyZQO4JowD20It374uBXwHX7Szd5d8JMNftCiAXyThxbga+tqNcl38HvNy3KoDcRGPESxK4a+UzgUvAx4HbYyAao0oFMEafeszyAvAV4GULkrsPuAj8fMG1XlKRgAKoCHvSo14J3Ai8AngW8JhDnX8GfgHcA/wQ+Nek9Q9dlgIYun3dJZ9+MyB9byB9avCR7rIzoRMEFIBDIYHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAQUQODmW7oEFIAzIIHABBRA4OZbugQUgDMggcAEFEDg5lu6BBSAMyCBwAT+DUAlfhDjJaoTAAAAAElFTkSuQmCC'}}
            />
          </View>
        </TouchableNativeFeedback>
      </KeyboardAvoidingView>
    )
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'ClassCast Location Permission',
          'message': 'ClassCast needs access to you location ' +
          'so you can find the best teachers near you.'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation();
      } else {
        ToastAndroid.show('Location permission denied.', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.warn(err)
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  userDataUpdate: userDataUpdate,
  goTo: goTo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Location)