import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Loading from '../components/Loading'
import { sideMenu } from '../configs/menu/sideMenu'
import { connect } from 'react-redux'

class SplashScreen extends Component {

  componentDidMount() {
    const { authenticated, user } = this.props.auth
    if (authenticated) {
      if (user?.displayName) {
        Navigation.setRoot({
          root: {
            sideMenu
          }
        });
      } else {
        Navigation.setRoot({
          root: {
            component: {
              name: 'UpdateProfile'
            }
          }
        });
      }
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