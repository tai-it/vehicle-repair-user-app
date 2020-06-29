import React, { Component } from 'react'
import { Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux'
import ToggleSwitch from 'toggle-switch-react-native'

class GetStartedScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isOn: false
    }
  }

  checkLocationPermission = async () => {
    let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (!locationPermission) {
      locationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (locationPermission !== 'granted') {
        alert('We need to access your location!')
      } else {
        console.log("Cập nhật trạng thái permission")
      }
    }
  }

  handleOnToggle = async isOn => {
    this.setState({ isOn })
    await this.checkLocationPermission()
  }

  handleGetStartedButtonPressed = async () => {
    await this.checkLocationPermission()
  }

  render() {
    const { isOn } = this.state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={this.handleGetStartedButtonPressed}>
          <Text>Enable Location Access</Text>
        </TouchableOpacity>
        <ToggleSwitch
          isOn={isOn}
          onColor={APP_COLOR}
          offColor="red"
          label="Sử dụng lưu động"
          size="medium"
          onToggle={() => this.handleOnToggle(!isOn)}
        />
      </View>
    )
  }
}

const mapState = state => {
  return {
    app: state.app
  }
}

const mapAction = dispatch => {
  return {

  }
}

export default connect(mapState, mapAction)(GetStartedScreen)