import {Dimensions, StyleSheet} from 'react-native';

const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  menuBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  accountInfo: {
    height: 30 * vh,
    width: 50 * vw,
    marginLeft: 10 * vw,
    marginTop: 10 * vh,
    alignItems: 'center',
  },
  userImage: {
    height: 20 * vh,
    width: 20 * vh,
    borderRadius: 500,
    borderWidth: vw,
    borderColor: 'white',
  },
  userName: {
    fontSize: 6 * vw,
    color: 'white',
    marginTop: vh,
    textAlign: 'center',
  },
  userClass: {
    fontSize: 16,
    color: 'white',
    opacity: 0.75
  },
  links: {
    height: 40 * vh,
    width: 50 * vw,
    marginLeft: 10 * vw,
    marginTop: 47.5 * vh,
    alignItems: 'center',
    position: 'absolute',
  },
  link: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  linkIcon: {
    height: '60%',
    width: '20%',
    marginLeft: '2.5%',
    marginRight: '5%',
  },
  linkText: {
    color: 'white',
    fontSize: 4.5 * vw,
    letterSpacing: 2,
  },
  overlay: {
    opacity: 0.5,

  },
  logo: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: 3.5 * vh,
    height: 3.5 * vh,
    marginLeft: 30 * vw,
    marginTop: -1.5 * vh,
  },
  imageModal: {
    height: 30 * vh,
    width: 70 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginLeft: 10 * vw,
    marginTop: 20 * vh,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    paddingTop: 2 * vh,
    paddingBottom: 2 * vh,
    paddingLeft: 5 * vw,
    paddingRight: 5 * vw,
    marginLeft: vw,
    marginRight: vw,
    borderRadius: 10,
    backgroundColor: '#73009e',
    marginTop: vh,
    marginBottom: vh,
    width: 40 * vw,
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonclose: {
    paddingTop: 2 * vh,
    paddingBottom: 2 * vh,
    paddingLeft: 5 * vw,
    paddingRight: 5 * vw,
    marginLeft: 25 * vw,
    marginRight: vw,
    borderRadius: 20,
    backgroundColor: '#df0000',
    marginTop: vh,
    marginBottom: vh,
    width: 40 * vw,
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
   backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default styles;