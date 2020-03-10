import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import { getDistance } from 'geolib'
import _ from 'lodash'
import { connect } from 'react-redux'
import { ToastAndroid } from 'react-native'

class StationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      marginTop: 0,
      mapHeight: 0,
      touchable: false,
      mapRegion: {
        latitude: props.options.userLocation.coords.lat,
        longitude: props.options.userLocation.coords.lng,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      },
      stations: props.stations
    }
  }

  componentDidMount() {
    ToastAndroid.show('Vui lòng đợi bản đồ...', ToastAndroid.LONG)
    Geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const { stations } = this.state
      stations.forEach(station => {
        Object.assign(station, { distance: getDistance(position.coords, station.coords) })
      });
      this.setState(prevState => ({
        mapRegion: {
          ...prevState.mapRegion,
          latitude, longitude
        },
        stations, touchable: true
      }))
    }, error => {
      console.log(error)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stations !== this.props.stations) {
      this.setState({
        stations: this.props.stations
      })
    }
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  };

  handleStationPressed = station => {
    Navigation.showModal({
      id: 'stationModal',
      component: {
        name: 'StationModal',
        passProps: {
          station
        }
      }
    })
  }

  render() {
    const { touchable, mapRegion, mapHeight, stations } = this.state
    return (
      <View pointerEvents={touchable ? 'auto' : 'none'}>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>Tiệm sửa xe quanh đây</Text>
          <View />
        </View>
        <MapView
          style={[{ height: mapHeight }, { marginTop: this.state.marginTop }]}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={() => this.setState({ marginTop: 0 })}
          followUserLocation={true}
        >
          {/* {stations.map(station => <Marker
            key={station.id}
            coordinate={station.coords}
            title={station.name}
          />)} */}
        </MapView>
        <FlatList
          data={_.orderBy(stations, ['distance'], ['asc'])}
          style={styles.list}
          renderItem={({ item }) => <TouchableOpacity
            style={styles.station}
            onPress={() => this.handleStationPressed(item)}
          >
            <View>
              <Text style={{ fontSize: 16, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{item.name}</Text>
              <Text style={{ color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{`Cách đây ${item.distance} mét`}</Text>
            </View>
            <Icon type="antdesign" name='right' color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} />
          </TouchableOpacity>}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          ListHeaderComponent={() => <View style={{ height: 1 }} />}
          onLayout={(event) => {
            const { width, height } = Dimensions.get('window')
            const newHeight = height - 85 - event.nativeEvent.layout.height
            this.setState({
              mapHeight: newHeight > width ? newHeight : width
            })
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.options
  }
}

export default connect(mapStateToProps, null)(StationList)

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: APP_COLOR
  },
  list: {
    maxHeight: height - width - 85
  },
  station: {
    padding: 10,
    backgroundColor: APP_COLOR,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  }
})