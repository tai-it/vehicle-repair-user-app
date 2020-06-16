import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Loading from '../components/Loading'
import { sideMenu } from '../configs/menu/sideMenu'
import { connect } from 'react-redux'
import { fcmService } from '../configs/notification/FCMService'
import { localNotificationService } from '../configs/notification/LocalNotificationService'
import * as Actions from '../redux/appRedux/actions'

class SplashScreen extends Component {

  componentDidMount() {
    // Register FCM Service
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    // Configure notification options
    localNotificationService.configure(this.onOpenNotification)

    const { authenticated } = this.props.auth
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

  render() {
    return (
      <Loading />
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeDeviceToken: token => dispatch(Actions.changeDeviceToken(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)