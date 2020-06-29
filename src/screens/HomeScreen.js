import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Icon, Header, Button, Card, Badge } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { APP_COLOR } from '../utils/AppSettings'
import Loading from '../components/Loading'
import { changeVehicle, changeLocation } from '../redux/optionsRedux/actions'
import { fetchProfileRequest } from '../redux/authRedux/actions'
import Vehicle from '../constants/vehicle'
import MapView from 'react-native-maps'
import Geocoder from 'react-native-geocoder'
import { options } from '../configs/navigation'

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marginTop: 1,
      address: props.options.userLocation.address,
      region: {
        latitude: props.options.userLocation.coords.lat,
        longitude: props.options.userLocation.coords.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      }
    }
  }

  componentDidMount = () => {
    this.props.onFetchProfile()
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

  handleOpenNotificationScreen = () => {
    Navigation.showModal({
      id: 'notificationScreen',
      component: {
        name: 'NotificationScreen',
        options
      }
    })
  }

  handleFindStations = () => {
    const { address, region: { latitude, longitude } } = this.state
    const location = {
      address,
      coords: {
        lat: latitude,
        lng: longitude
      }
    }
    this.props.onChangeLocation(location)
    Navigation.showModal({
      id: 'stationListModal',
      component: {
        name: 'StationListModal',
        options
      }
    })
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
    const { auth: { authenticated, loading }, options: { vehicle }, notify: { notifications } } = this.props
    const unreadNotify = notifications.filter(x => !x.isSeen)
    const { region, address } = this.state
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
        {/* HEADER */}
        <Header
          leftComponent={<Icon
            type="MaterialCommunityIcons"
            name="menu"
            color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            onPress={this.handleOpenSideMenu}
          />}
          centerComponent={{ text: address, style: { color: '#fff', fontSize: 16, marginHorizontal: -30 } }}
          rightComponent={<View>
            <Icon
              type="antdesign"
              name="bells"
              color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
              onPress={this.handleOpenNotificationScreen}
            />
            {unreadNotify.length > 0 &&
              <Badge
                status="error"
                value={unreadNotify.length}
                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
              />
            }
          </View>}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        {/* MAP VIEW */}
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
                color="red"
                size={50}
              />
            </View>
          </View>
        </View>
        {/* CARD VEHICLES */}
        <Card containerStyle={{ margin: 0, padding: 10 }}>
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
            </TouchableOpacity>
          </View>
          <Button
            title="TÌM TIỆM SỬA XE"
            loading={loading}
            containerStyle={{ marginTop: 5 }}
            buttonStyle={{ paddingVertical: 15 }}
            onPress={this.handleFindStations}
          />
        </Card>
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
    paddingVertical: 10,
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
    options: state.options,
    notify: state.notify
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeVehicle: vehicle => dispatch(changeVehicle(vehicle)),
    onChangeLocation: location => dispatch(changeLocation(location)),
    onFetchProfile: () => dispatch(fetchProfileRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)