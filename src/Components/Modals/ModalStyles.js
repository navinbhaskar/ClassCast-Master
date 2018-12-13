import {Dimensions, StyleSheet} from 'react-native';

const screen = Dimensions.get('window');
const [vw, vh] = [screen.width / 100, screen.height / 100];

const styles = StyleSheet.create({
  container: {
    height: 100 * vh,
    width: 100 * vw,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    elevation: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tncModal: {
    height: 80 * vh,
    width: 90 * vw,
    backgroundColor: 'white',
    borderRadius: 1.5 * vw,
    paddingTop: 5 * vh,
    paddingLeft: 7.5 * vw,
    paddingRight: 7.5 * vw,
    paddingBottom: 5 * vh,
  },
  tncHeadingBig: {
    fontSize: 6 * vw,
    color: 'black',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 2 * vh,
  },
  tncText: {
    color: 'black',
    fontSize: 3.5 * vw,
    marginBottom: 2 * vh,
  },
  tncTextListItem: {
    color: 'black',
    fontSize: 3.5 * vw,
    marginBottom: 2 * vh,
    marginLeft: 2 * vw,
  },
  tncHeadingSmall: {
    fontSize: 4.5 * vw,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
    marginBottom: 2 * vh,
  },
  contactInfo: {
    fontSize: 3.5 * vw,
    color: 'black',
    fontFamily: 'Montserrat-Bold'
  },
  tncButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  tncButton: {
    fontSize: 4.5 * vw,
    fontFamily: 'Montserrat-Bold',
    color: '#754faf',
    marginTop: 2 * vh,
  },
  unlockModal: {
    height: 30 * vh,
    width: 90 * vw,
    backgroundColor: 'white',
    borderRadius: 1.5 * vw,
    paddingTop: 5 * vh,
    paddingLeft: 7.5 * vw,
    paddingRight: 7.5 * vw,
    paddingBottom: 5 * vh,
    alignItems: 'center',
  },
  challengeModal: {
    height: 80 * vh,
    width: 90 * vw,
    borderRadius: 1.5 * vw,
    paddingTop: 5 * vh,
    paddingLeft: 7.5 * vw,
    paddingRight: 7.5 * vw,
    paddingBottom: 5 * vh,
    alignItems: 'center',
  },
  unlockModalMessage: {
    textAlign: 'center',
    fontSize: 5 * vw,
  },
  unlockModalButton: {
    backgroundColor: '#754faf',
    paddingTop: 1.25 * vh,
    paddingBottom: 1.25 * vh,
    paddingLeft: 4.5 * vw,
    paddingRight: 4.5 * vw,
    borderRadius: 1.5 * vw,
    marginTop: 4 * vh,
  },
  unlockModalButtonText: {
    fontSize: 4 * vw,
    color: 'white',
  },
  challengeTopSection: {
    height: 50 * vh,
    width: 90 * vw,
    borderRadius: 5 * vw,
    backgroundColor: 'white',
    elevation: 2,
    alignItems: 'center',
  },
  challengedIcon: {
    flex: 1,
    width: '85%',
  },
  challengeTopSectionText: {
    fontSize: 4.5 * vw,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5 * vh,
    paddingLeft: 10 * vw,
    paddingRight: 10 * vw,
    color: 'black',
  },
  challengeBottomSection: {
    backgroundColor: 'white',
    width: 80 * vw,
    borderBottomRightRadius: 5 * vw,
    borderBottomLeftRadius: 5 * vw,
  },
  challengeButtonContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  challengeAcceptText: {
    fontSize: 4.75 * vw,
    color: 'black',
    paddingLeft: 10 * vw,
    paddingRight: 10 * vw,
    textAlign: 'center',
    marginTop: 2 * vh,
    marginBottom: 2 * vh,
  },
  challengeModalButton: {
    flex: 1,
    height: 7.5 * vh,
    backgroundColor: '#a267cb',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 5 * vw,
  },
  challengeModalButtonLeft: {
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 5 * vw,
    borderBottomRightRadius: 0,
    color: 'black',
  },
  challengeModalButtonText: {
    fontSize: 5 * vw,
    fontFamily: 'Montserrat-Medium',
  },
});

export default styles;