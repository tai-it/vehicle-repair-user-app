import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import Geolocation from 'react-native-geolocation-service'
import { getDistance } from 'geolib'
import _ from 'lodash'
import { connect } from 'react-redux'

class StationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stations: props.stations
    }
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(position => {
      const { stations } = this.state
      stations.forEach(station => {
        Object.assign(station, { distance: getDistance(position.coords, station.coords) })
      })
      this.setState({ stations })
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
  }

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
    const { stations } = this.state
    return (
      <View>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>Tiệm sửa xe quanh đây</Text>
          <Icon type="antdesign" name="filter" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
        </View>
        <FlatList
          data={_.orderBy(stations, ['distance'], ['asc'])}
          // renderItem={({ item }) => <TouchableOpacity
          //   style={styles.station}
          //   onPress={() => this.handleStationPressed(item)}
          // >
          //   <View>
          //     <Text style={{ fontSize: 16, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{item.name}</Text>
          //     <Text style={{ color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{`Cách đây ${item.distance} mét`}</Text>
          //   </View>
          //   {/* <Icon type="antdesign" name='right' color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} /> */}
          // </TouchableOpacity>}
          renderItem={({ item }) => <ListItem
            onPress={() => this.handleStationPressed(item)}
            key={item.id}
            title={item.name}
            subtitle={`Cách đây ${item.distance} mét`}
            bottomDivider
            chevron
          />}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
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
  station: {
    padding: 10,
    backgroundColor: APP_COLOR,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  }
})