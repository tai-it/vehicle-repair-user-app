import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { APP_COLOR } from '../utils/AppSettings'
import OptionsModal from '../components/Home/OptionsModal'
import Loading from '../components/Loading'
import { changeVehicle, changeLocation } from '../redux/optionsRedux/actions'
import { updateDeviceTokenRequest } from '../redux/authRedux/actions'
import Vehicle from '../constants/vehicle'
import MapView, { Marker } from 'react-native-maps'
import Geocoder from 'react-native-geocoder'

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marginTop: 1,
      showOptions: false,
      address: props.options.userLocation.address,
      region: {
        latitude: props.options.userLocation.coords.lat,
        longitude: props.options.userLocation.coords.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      }
    }
  }

  componentDidMount = async () => {
    this.checkDeviceToken()
  }

  componentDidUpdate(prevProps) {
    const { lat, lng } = this.props.options.userLocation.coords
    if (lat !== prevProps.options.userLocation.coords.lat || lng !== prevProps.options.userLocation.coords.lng) {
      this.setState(prevState => ({
        ...prevState,
        region: {
          ...prevState.region,
          latitude: lat,
          longitude: lng
        }
      }))
    }
  }

  checkDeviceToken = () => {
    const { deviceToken } = this.props.app
    const { user } = this.props.auth
    if (user) {
      if (deviceToken !== user.deviceToken) {
        this.props.onUpdateDeviceToken()
      }
    }
  }

  onRegionChangeComplete = region => {
    this.setState({ region })
    const { latitude, longitude } = region
    Geocoder.geocodePosition({
      lat: latitude,
      lng: longitude
    })
      .then(res => {
        const location = {
          address: res[0].formattedAddress.replace('Unnamed Road, ', ''),
          coords: res[0].position
        }
        this.setState({ address: location.address })
      })
      .catch(err => console.log(err))
  }

  handleOpenSearchLocationModal = () => {
    console.log("Open search location modal");
  }

  handleButtonSearchPressed = () => {
    const { address, region: { latitude, longitude } } = this.state
    const location = {
      address,
      coords: {
        lat: latitude,
        lng: longitude
      }
    }
    this.props.onChangeLocation(location)
    this.setState({ showOptions: true })
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
    const { authenticated, user, loading } = this.props.auth
    const { showOptions, region, address } = this.state
    const { vehicle } = this.props.options
    if (!authenticated) {
      Navigation.setRoot({
        root: {
          component: {
            name: 'AuthScreen'
          }
        }
      })
      return <View />
    }
    if (loading) {
      return <Loading message="Đang tải thông tin" />
    }
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
            justifyContent: 'space-between',
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
          <Text style={{ fontSize: 20, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{user?.name.toUpperCase()}</Text>
          <View />
        </View>
        <View style={{ flex: 1 }}>
          <MapView
            style={[StyleSheet.absoluteFillObject, { marginTop: this.state.marginTop }]}
            onMapReady={() => this.setState({ marginTop: 0 })}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followUserLocation={true}
            showsCompass={true}
            onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
          />
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ marginBottom: 35 }}>
              <Icon
                type="material-community"
                name="map-marker-outline"
                color={APP_COLOR}
                size={50}
              />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 1, borderColor: APP_COLOR, borderWidth: 1 }}>
          <View style={{ padding: 10, borderRightWidth: 1, borderColor: APP_COLOR }}>
            <Icon
              type="entypo"
              name="location"
              color={APP_COLOR}
            />
          </View>
          <Text numberOfLines={1} style={{ alignSelf: "center", padding: 10, fontSize: 16, overflow: "hidden" }} onPress={this.handleOpenSearchLocationModal} >{address}</Text>
        </View>
        <View style={{ flexDirection: 'row', borderColor: APP_COLOR, borderWidth: 1 }}>
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
          onPress={this.handleButtonSearchPressed}
        >
          <Text style={{ fontSize: 18, color: '#fff' }}>TÌM TIỆM SỬA XE</Text>
        </TouchableOpacity>
      </View >
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
    onChangeLocation: location => dispatch(changeLocation(location)),
    onUpdateDeviceToken: () => dispatch(updateDeviceTokenRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)