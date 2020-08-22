import React, { Component } from 'react'
import { sideMenu } from '../configs/menu/sideMenu'
import { connect } from 'react-redux'
import { fcmService } from '../configs/notification/FCMService'
import { localNotificationService } from '../configs/notification/LocalNotificationService'
import * as Actions from '../redux/appRedux/actions'
import { changeLocation } from '../redux/optionsRedux/actions'
import { PermissionsAndroid, View, StyleSheet, SafeAreaView, Image, Text } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import Geocoder from 'react-native-geocoder'
import { fetchNotifications } from '../redux/notifyRedux/actions'
import { fetchOrders } from '../redux/orderRedux/actions'
import Navigator from '../utils/Navigator'
import AppIntroSlider from 'react-native-app-intro-slider'
import SplashScreen from 'react-native-splash-screen'
import { Icon } from 'react-native-elements'

const data = [
  {
    title: 'NHANH CHÓNG, TIỆN LỢI',
    description: 'Kết nối đến các tiệm sửa xe nhanh chóng',
    image: require('../assets/images/app_logo_image.png'),
    bg: '#59b2ab',
  },
  {
    title: 'GIÁ CẢ RÕ RÀNG',
    description: 'Xem giá từng dịch vụ trước khi đặt',
    image: require('../assets/images/app_logo_image.png'),
    bg: '#febe29',
  },
  {
    title: 'BẮT ĐẦU',
    description: "Cho phép ứng dụng truy cập vị trí của bạn",
    image: require('../assets/images/app_logo_image.png'),
    bg: '#22bcb5',
  }
]

class GetStartedScreen extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // Register FCM Service
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    // Configure notification options
    localNotificationService.configure(this.onOpenNotification)

    const { isStarted } = this.props.app

    if (isStarted) {
      this.getCurrentLocation()
      this.checkAuth()
    } else {
      SplashScreen.hide()
    }
  }

  componentDidUpdate = (prevProps) => {
    const { isStarted } = this.props.app
    if (isStarted && isStarted !== prevProps.app.isStarted) {
      this.getCurrentLocation()
      this.checkAuth()
    }
  }

  // NOTIFICATION SETUP
  onRegister = (token) => {
    this.props.onChangeDeviceToken(token)
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

  onOpenNotification = (data) => {
    const notifyId = data?.id
    if (notifyId) {
      // SHOW POP-UP HERE
      this.props.onFetchOrders()
      this.props.onFetchNotifications()
    } else {
      Navigator.dismissAllModals()
      Navigator.showModal('NotificationScreen')
    }
  }
  // END NOTIFICATION SETUP

  checkAuth = () => {
    const { auth: { authenticated } } = this.props
    if (authenticated) {
      Navigator.setRoot({
        sideMenu
      })
    } else {
      Navigator.setRoot({
        component: {
          name: 'LoginScreen'
        }
      })
      SplashScreen.hide()
    }
  }

  checkLocationPermission = async () => {
    let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (!locationPermission) {
      locationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (locationPermission !== 'granted') {
        Navigator.showOverlay({ message: 'Để ứng dụng biết được vị trí chính xác, vui lòng cho phép ứng dụng truy cập vị trí của bạn' })
        return false
      }
    }
    return true
  }

  getCurrentLocation = async () => {
    await Geolocation.getCurrentPosition(async position => {
      await Geocoder.geocodePosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
        .then(res => {
          const location = {
            address: res[0].formattedAddress.replace('Unnamed Road, ', ''),
            coords: res[0].position
          }
          this.props.onChangeLocation(location)
        })
        .catch(err => console.log(err))
    }, async error => {
      await this.checkLocationPermission()
    })
  }

  handleStartBtnPressed = async () => {
    const granted = await this.checkLocationPermission()
    if (granted) {
      await this.getCurrentLocation()
      this.props.onGetStarted()
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.bg,
        }}>
        <SafeAreaView style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Image source={item.image} style={styles.image} />
        </SafeAreaView>
      </View>
    )
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          type="feather"
          name="arrow-right"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    )
  }

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          type="feather"
          name="check"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    )
  }

  _keyExtractor = (item) => item.title

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppIntroSlider
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          onDone={this.handleStartBtnPressed}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.title}
          data={data}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 50
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 50,
    fontSize: 16
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeLocation: location => dispatch(changeLocation(location)),
    onChangeDeviceToken: token => dispatch(Actions.changeDeviceToken(token)),
    onGetStarted: () => dispatch(Actions.getStarted()),
    onFetchNotifications: pageIndex => dispatch(fetchNotifications(pageIndex)),
    onFetchOrders: pageIndex => dispatch(fetchOrders(pageIndex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GetStartedScreen)