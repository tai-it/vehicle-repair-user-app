import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import { Icon, ListItem, Header, Card, Overlay, CheckBox, Button, Badge } from 'react-native-elements'
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import _ from 'lodash'
import { connect } from 'react-redux'
import { fetchServices, fetchStations, changeAmbulatory } from '../../redux/optionsRedux/actions'
import { options } from '../../configs/navigation'
import ToggleSwitch from 'toggle-switch-react-native'

class StationListModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowSortModal: false,
      selectedServices: []
    }
  }

  componentDidMount() {
    this.props.onFetchStations()
    this.props.onFetchService()
  }

  handleLoadMore = () => {
    const { hasNextPage, pageIndex } = this.props.options
    if (hasNextPage) {
      this.props.onFetchStations(pageIndex + 1)
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
        },
        options
      }
    })
  }

  handleServicePressed = service => {
    const { selectedServices } = this.state
    const index = selectedServices.indexOf(service)
    if (index > -1) {
      selectedServices.splice(index, 1)
    } else {
      selectedServices.push(service)
    }
    this.setState({ selectedServices })
  }

  sort = stations => {
    const { selectedServices } = this.state // ["service name", "service name"]
    const { useAmbulatory } = this.props.options
    stations = _.orderBy(stations, ['distance'], ['asc'])
    if (useAmbulatory) {
      stations = stations.filter(station => station.hasAmbulatory)
    }
    // Find stations have all selected services
    return stations.filter(station =>
      selectedServices.every(s =>
        station.services.find(service =>
          service.name.toLowerCase().includes(s.toLowerCase())
        )
      )
    )
  }

  render() {
    const { stations, services, hasNextPage, fetchingStations, fetchingServices, useAmbulatory } = this.props.options
    const { isShowSortModal, selectedServices } = this.state
    const list = this.sort(stations)
    return (
      <>
        {/* HEADER */}
        <Header
          leftComponent={<Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />}
          centerComponent={{ text: "TIỆM XE QUANH ĐÂY", style: { color: '#fff', fontSize: 18, marginHorizontal: -30 } }}
          rightComponent={<Icon type="antdesign" name="filter" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={() => this.setState({ isShowSortModal: true })} />}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />

        {/* SORT MODAL OVERLAY */}
        <Overlay
          isVisible={isShowSortModal}
          onBackdropPress={() => this.setState({ isShowSortModal: false })}
          windowBackgroundColor="rgba(0, 0, 0, 0.5)"
          overlayBackgroundColor="white"
          width="80%"
        >
          <Card
            title="TUỲ CHỌN"
            titleStyle={{ marginBottom: 0, paddingVertical: 15 }}
            dividerStyle={{ height: 0 }}
            containerStyle={{
              margin: 10,
              padding: 0,
              height: 50
            }}
          />

          <View style={{ marginRight: 10 }}>
            <ToggleSwitch
              isOn={useAmbulatory}
              onColor={APP_COLOR}
              offColor="red"
              label="Sử dụng lưu động"
              labelStyle={{ flex: 1, paddingVertical: 10, fontSize: 16 }}
              size="medium"
              onToggle={() => this.props.onChangeAmbulatory(!useAmbulatory)}
            />
          </View>

          <FlatList
            contentContainerStyle={{}}
            data={services}
            renderItem={({ item }) =>
              <CheckBox
                containerStyle={{ flex: 1 }}
                textStyle={{ fontSize: 16, fontWeight: "normal" }}
                title={item}
                onPress={() => this.handleServicePressed(item)}
                checked={selectedServices.indexOf(item) > -1 ? true : false}
              />
            }
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          />
          <Button
            title="ĐẶT LẠI"
            disabled={fetchingServices}
            containerStyle={{ margin: 10 }}
            buttonStyle={{ paddingVertical: 15 }}
            onPress={() => this.setState({ selectedServices: [] })}
          />
        </Overlay>

        {/* STATION LIST */}
        {fetchingStations && <Loading style={{ justifyContent: "center", alignItems: "center", height: '90%' }} message="Đang tìm cửa hàng" /> ||
          <Card containerStyle={{
            flex: 1,
            margin: 5,
            marginBottom: 5,
            padding: 0
          }}>
            {list.length > 0 ? <FlatList
              data={list}
              renderItem={({ item }) =>
                <ListItem
                  onPress={() => this.handleStationPressed(item)}
                  key={item.id}
                  title={item.name}
                  subtitle={`Cách đây ${(item.distance / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`}
                  rightIcon={() => <Badge status={item.isAvailable ? "success" : "warning"} />}
                  rightSubtitle={item.isAvailable ? "Đang hoạt động" : "Đang đóng cửa"}
                />
              }
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.05}
              onEndReached={this.handleLoadMore}
              onRefresh={this.props.onFetchStations}
              refreshing={false}
              ListFooterComponent={() => {
                return hasNextPage && <Loading /> || <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />
              }}
            /> :
              <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16 }}>Không tìm thấy tiệm xe nào quanh đây</Text>
              </View>
            }
          </Card>
        }
      </>
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
    onFetchStations: pageIndex => dispatch(fetchStations(pageIndex)),
    onChangeAmbulatory: option => dispatch(changeAmbulatory(option))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StationListModal)