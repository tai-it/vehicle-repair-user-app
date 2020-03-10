import React, { Component } from 'react'
import { PermissionsAndroid, BackHandler, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { APP_COLOR } from '../utils/AppSettings'
import OptionsModal from '../components/Home/OptionsModal'
import { changeVehicle, changeLocation } from '../redux/optionsRedux/actions'
import Geocoder from 'react-native-geocoder'
import Geolocation from 'react-native-geolocation-service'
import Vehicle from '../constants/vehicle'

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showOptions: false
    }
  }

  componentDidMount = async () => {
    let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (!locationPermission) {
      locationPermission = await this.askLocationPermission()
      if (locationPermission !== 'granted') {
        Alert.alert('Message', 'We need to access your location!')
        setTimeout(() => BackHandler.exitApp(), 1000)
      }
    }
    Geolocation.getCurrentPosition(position => {
      Geocoder.geocodePosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
        .then(res => {
          let location = {
            address: res[0].formattedAddress.replace('Unnamed Road, ', ''),
            coords: res[0].position
          }
          this.props.onChangeLocation(location)
        })
        .catch(err => console.log(err))
    }, error => {
      console.log(error)
    })

  }

  askLocationPermission = async () => {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    return result
  }

  onRegionChange = (mapRegion, lastLatitude, lastLongitude) => {
    if (this.state.mapRegion !== mapRegion || this.state.lastLatitude !== lastLatitude || this.state.lastLongtitude !== lastLongitude) {
      this.setState({ mapRegion, lastLatitude, lastLongitude });
    }
  }

  handleOpenSideMenu = () => {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: true,
        },
      },
    });
  };

  render() {
    const { authenticated, user } = this.props.auth
    if (!authenticated) {
      Navigation.dismissAllModals()
      Navigation.setRoot({
        root: {
          component: {
            name: 'AuthScreen'
          }
        }
      })
      return <View />
    }
    const { showOptions } = this.state
    const { options: { vehicle, userLocation } } = this.props
    return (
      <View style={[styles.container]}>
        <OptionsModal
          visible={showOptions}
          onDismissModal={() => this.setState({ showOptions: false })}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 18,
            borderBottomWidth: 1,
            borderColor: '#E9E9E9',
            backgroundColor: APP_COLOR
          }}>
          <Icon
            type="MaterialCommunityIcons"
            name="menu"
            color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            onPress={this.handleOpenSideMenu}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>{`Hi ${user.firstName},`}</Text>
          <Text style={{ fontSize: 25, textAlign: "center", maxWidth: '90%', marginBottom: 20 }}>{`Bạn đang ở ${userLocation.address}`}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.vehicle, vehicle === Vehicle.bike ? styles.active : styles.noneActive]}
            onPress={() => this.props.onChangeVehicle(Vehicle.bike)}
          >
            <Icon
              type="material-community"
              name="bike"
              color={vehicle === Vehicle.bike ? 'white' : 'black'}
            />
            <Text style={{ fontSize: 15, color: vehicle === Vehicle.bike ? 'white' : 'black' }}>{Vehicle.bike}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.vehicle, vehicle === Vehicle.motobike ? styles.active : styles.noneActive]}
            onPress={() => this.props.onChangeVehicle(Vehicle.motobike)}
          >
            <Icon
              type="material-community"
              name="motorbike"
              color={vehicle === Vehicle.motobike ? 'white' : 'black'}
              size={30}
            />
            <Text style={{ fontSize: 15, color: vehicle === Vehicle.motobike ? 'white' : 'black' }}>{Vehicle.motobike}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.vehicle, vehicle === Vehicle.car ? styles.active : styles.noneActive]}
            onPress={() => this.props.onChangeVehicle(Vehicle.car)}
          >
            <Icon
              type="material-community"
              name="car"
              color={vehicle === Vehicle.car ? 'white' : 'black'}
            />
            <Text style={{ fontSize: 15, color: vehicle === Vehicle.car ? 'white' : 'black' }}>{Vehicle.car}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 18,
            backgroundColor: APP_COLOR,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1
          }}
          onPress={() => this.setState({ showOptions: true })}
        >
          <Text style={{ fontSize: 18, color: '#fff' }}>TÌM TIỆM SỬA XE</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  vehicle: {
    flex: 1,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  active: {
    backgroundColor: APP_COLOR
  },
  noneActive: {
    backgroundColor: '#fff'
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeVehicle: vehicle => dispatch(changeVehicle(vehicle)),
    onChangeLocation: location => dispatch(changeLocation(location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)