import React, { Component } from 'react'
// import MapView, { Marker } from 'react-native-maps'
import { PermissionsAndroid, BackHandler, View, Text, StyleSheet } from 'react-native'
import { Alert } from 'react-native'
// import Geolocation from 'react-native-geolocation-service'

export default class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mapRegion: {
        latitude: 17.1429779,
        longitude: 106.8515723,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      },
      lastLatitude: null,
      lastLongtitude: null,
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

  render() {
    const { mapRegion, lastLatitude, lastLongitude } = this.state
    const stations = [
      {
        name: 'Sửa xe Văn Khờn',
        latitude: 17.14246101551532,
        longitude: 106.85243164771059
      },
      {
        name: 'Sửa xe Văn Hùng',
        latitude: 17.140636112660435,
        longitude: 106.84671532464385
      },
      {
        name: 'Sửa xe Văn Luận',
        latitude: 17.142096035001885,
        longitude: 106.85335861940807
      }
    ]
    return (
      // <MapView
      //   style={styles.map}
      //   initialRegion={mapRegion}
      //   showsUserLocation={true}
      //   followUserLocation={true}
      // >
      //   {stations.map(station => <Marker
      //     key={station.name}
      //     coordinate={{
      //       latitude: station.latitude,
      //       longitude: station.longitude,
      //     }}
      //     title={station.name}
      //   />)}
      // </MapView>
      <View style={[styles.map, { backgroundColor: 'red' }]}>
        <Text>Home Screen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    height: '100%'
  }
})