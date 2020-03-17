import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Loading from '../components/Loading'
import { sideMenu } from '../configs/menu/sideMenu'
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'

class SplashScreen extends Component {

  componentDidMount() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase.messaging().requestPermission()
            .then(() => {
              console.log('User has authorised')
            })
            .catch(error => {
              console.log('User has rejected permissions')
            })
        }
      })
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      console.log("SplashScreen -> componentDidMount -> onTokenRefresh -> fcmToken", fcmToken)
    })
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

  componentWillUnmount() {
    this.onTokenRefreshListener()
  }

  render() {
    return (
      <Loading />
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, null)(SplashScreen)