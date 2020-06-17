import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import { sideMenu } from '../configs/menu/sideMenu'
import { connect } from 'react-redux'
import { fcmService } from '../configs/notification/FCMService'
import { localNotificationService } from '../configs/notification/LocalNotificationService'
import * as Actions from '../redux/appRedux/actions'
import { fetchLocation } from '../redux/optionsRedux/actions'
import { PermissionsAndroid } from 'react-native'

//
import Swiper from 'react-native-web-swiper'
import SwiperItem from '../components/Splash/SwiperItem'
import { swipers } from '../data/swipers'
//

class SplashScreen extends Component {

  componentDidMount = async() => {
  // Register FCM Service
  fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  // Configure notification options
  localNotificationService.configure(this.onOpenNotification)

  // Check permission: true/false
  const locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  if (locationPermission) {
    // Get user's current location
    this.props.fetchCurrentLocation()
  }
}

checkLocationPermission = async () => {
  let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  if (!locationPermission) {
    locationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    console.log("SplashScreen -> checkLocationPermission -> locationPermission", locationPermission)
    if (locationPermission !== 'granted') {
      alert('We need to access your location!')
    }
  } else {
    return "granted"
  }
}

// NOTIFICATION SETUP
onRegister = (token) => {
  const { deviceToken } = this.props.app
  if (deviceToken !== token) {
    this.props.onChangeDeviceToken(token)
  }
}

onNotification = (notify) => {
  const options = {
    playSound: false
  }
  localNotificationService.showNotification(
    0,
    notify.title,
    notify.body,
    notify,
    options
  )
}

onOpenNotification = (notify) => {
  // const order = JSON.parse(Object.values(notify)[0])
  console.log("SplashScreen -> onOpenNotification -> notify", notify)
  alert(notify?.body || "Hello, No Content")
}
// END NOTIFICATION SETUP

componentWillUnmount() {
  // fcmService.unregister()
  // localNotificationService.unregister()
}

handleStartBtnPressed = async () => {
  const granted = await this.checkLocationPermission()
  if (granted === "granted") {
    this.props.onGetStarted()
  }
}

render() {
  const { authenticated } = this.props.auth
  const { isStarted } = this.props.app
  if (isStarted) {
    if (authenticated) {
      Navigation.setRoot({
        root: {
          sideMenu
        }
      });
    } else {
      Navigation.setRoot({
        root: {
          component: {
            name: 'AuthScreen'
          }
        }
      });
    }
  }
  return (
    <Swiper
      controlsProps={{
        prevPos: false,
        nextPos: false,
        dotsWrapperStyle: {
          bottom: 130,
        },
      }}>
      {swipers.map((item, index) => {
        return (
          <SwiperItem
            key={index}
            item={item}
            onButtonStartPressed={this.handleStartBtnPressed}
          />
        );
      })}
    </Swiper>
  )
}
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCurrentLocation: () => dispatch(fetchLocation()),
    onChangeDeviceToken: token => dispatch(Actions.changeDeviceToken(token)),
    onGetStarted: () => dispatch(Actions.getStarted())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)