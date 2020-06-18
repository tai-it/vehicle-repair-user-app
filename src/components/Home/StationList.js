import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import _ from 'lodash'
import { connect } from 'react-redux'
import { fetchServices, fetchStations } from '../../redux/optionsRedux/actions'
import { options } from '../../configs/navigation'

class StationList extends Component {

  componentDidMount() {
    this.props.onFetchStations()
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
        },
        options
      }
    })
  }

  render() {
    const { stations, fetchingStations } = this.props.options
    return (
      <View>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>TIỆM XE QUANH ĐÂY</Text>
          <Icon type="antdesign" name="filter" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
        </View>
        {fetchingStations && <Loading style={{ justifyContent: "center", alignItems: "center", height: '90%' }} message="Đang tìm cửa hàng" /> ||
          <>
            <FlatList
              data={_.orderBy(stations, ['distance'], ['asc'])}
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
          </>
        }
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchService: () => dispatch(fetchServices()),
    onFetchStations: () => dispatch(fetchStations())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StationList)

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