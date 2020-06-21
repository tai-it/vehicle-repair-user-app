import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking, FlatList } from 'react-native'
import { APP_COLOR } from '../../utils/AppSettings'
import { Icon, CheckBox, Header, Card, Button } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import Loading from '../../components/Loading'
import ToggleSwitch from 'toggle-switch-react-native'
import { changeAmbulatory } from '../../redux/optionsRedux/actions'
import callApi from '../../utils/apiCaller'
import { options } from '../../configs/navigation'

class StationModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      station: null,
      selectedServices: [],
      reviews: [],
      loading: true,
      booking: false,
      totalServiceFee: 0,
      ambulatoryFee: props.options.useAmbulatory ? props.station.distance * 8 : 0
    }
  }

  componentDidMount = () => {
    this.fetchStationDetail()
  }

  handleServicePressed = service => {
    const { selectedServices } = this.state
    const index = selectedServices.indexOf(service)
    if (index > -1) {
      selectedServices.splice(index, 1)
    } else {
      selectedServices.push(service)
    }
    this.totalSalcserviceFee(selectedServices)
  }

  fetchStationDetail = async () => {
    const { id } = this.props.station
    const response = await callApi(`stations/${id}`)
    const station = response.data
    if (!station.hasAmbulatory) {
      this.props.onChangeAmbulatory(false)
    }
    this.setState({
      station,
      loading: false
    })
  }

  totalSalcserviceFee = (selectedServices) => {
    this.setState({
      selectedServices,
      totalServiceFee: selectedServices.reduce((totalServiceFee, service) => totalServiceFee + parseInt(service.price), 0)
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props
    Linking.openURL(`google.navigation:q=${station?.latitude},${station?.longitude}`)
  }

  handleChangeAmbulatoryOption = (useAmbulatory) => {
    const { distance, hasAmbulatory } = this.props.station
    if (hasAmbulatory) {
      this.setState({ ambulatoryFee: useAmbulatory ? distance * 8 : 0 }, () => {
        this.props.onChangeAmbulatory(useAmbulatory)
        this.totalSalcserviceFee(this.state.selectedServices)
      })
    } else {
      alert("Rất tiếc, tiệm sửa xe này không có dịch vụ này!")
    }
  }

  handleBooking = async () => {
    const { selectedServices } = this.state
    if (selectedServices.length > 0) {
      this.setState({ booking: true })
      const { station: { id, distance }, options: { userLocation: { address, coords }, useAmbulatory }, auth: { token } } = this.props
      const orderDetails = selectedServices.map(service => {
        return {
          serviceId: service.id
        }
      })
      const order = {
        stationId: id,
        address,
        latitude: coords.lat,
        longitude: coords.lng,
        distance,
        useAmbulatory,
        orderDetails
      }
      try {
        const response = await callApi("orders", "POST", order, token)
        // OPEN ORDER DETAIL MODAL
        Navigation.showModal({
          id: 'orderDetailModal',
          component: {
            name: 'OrderDetailModal',
            passProps: {
              order: response?.data
            },
            options
          }
        })
      } catch (error) {
        alert(error?.response?.data);
      }
      this.setState({ booking: false })
    }
  }

  getServiceTitle = service => {
    const { name, description, price } = service
    if (description !== null) {
      return `${name}\n(${description})\n${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
    }
    return `${name}\n${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
  }

  render() {
    const { options: { useAmbulatory } } = this.props
    const { loading, booking, station, selectedServices, totalServiceFee, ambulatoryFee } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <Header
          leftComponent={<Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />}
          centerComponent={{ text: station?.name?.toUpperCase() || "", style: { color: '#fff', fontSize: 16, marginHorizontal: -30 } }}
          rightComponent={<Icon type="material-community" name="directions" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.openOnGoogleMaps} />}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        {loading ? <Loading message='Đang tải thông tin...' /> :
          <>
            <View style={{ flex: 1 }}>
              <FlatList
                data={station?.services}
                numColumns={1}
                renderItem={({ item }) =>
                  <CheckBox
                    containerStyle={{ flex: 1 }}
                    textStyle={{ fontSize: 16, fontWeight: "normal" }}
                    title={this.getServiceTitle(item)}
                    onPress={() => this.handleServicePressed(item)}
                    checked={selectedServices.indexOf(item) > -1 ? true : false}
                  />
                }
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
              />
            </View>
            <Card containerStyle={{ margin: 0 }}>
              <ToggleSwitch
                isOn={useAmbulatory}
                onColor="green"
                offColor="red"
                label={`Sử dụng lưu động (${ambulatoryFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ)`}
                labelStyle={{ flex: 1, fontSize: 16 }}
                size="medium"
                onToggle={() => this.handleChangeAmbulatoryOption(!useAmbulatory)}
              />
              <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Tổng cộng: {(totalServiceFee + (useAmbulatory && selectedServices.length > 0 ? ambulatoryFee : 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ</Text>
              <Button
                title="ĐẶT DỊCH VỤ"
                loading={booking}
                containerStyle={{ marginTop: 10 }}
                buttonStyle={{ paddingVertical: 15 }}
                onPress={this.handleBooking}
              />
            </Card>
          </>
        }
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeAmbulatory: option => dispatch(changeAmbulatory(option))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StationModal)

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
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
  heading: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#555'
  },
  service: {
    flex: 1,
    maxWidth: '50%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderColor: '#E9EBEE',
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 1
  }
})