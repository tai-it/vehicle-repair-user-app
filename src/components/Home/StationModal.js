import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking, FlatList } from 'react-native'
import { APP_COLOR } from '../../utils/AppSettings'
import { Icon } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import Vehicle from '../../constants/vehicle'
import Loading from '../../components/Loading'
import ToggleSwitch from 'toggle-switch-react-native'
import { changeAmbulatory } from '../../redux/optionsRedux/actions'
import { OrderStatus } from '../../constants/orderStatus'
import database from "@react-native-firebase/database"

class StationModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: [],
      selectedServices: [],
      reviews: [],
      loading: true,
      totalServiceFee: 0,
      ambulatoryFee: props.options.useAmbulatory ? props.station.distance * 8 : 0
    }
  }

  componentDidMount() {
    this.fetchServices()
    this.fetchReviews()
    setTimeout(() => this.setState({ loading: false }), 1000)
  }

  fetchServices = async () => {
    const { station: { id }, options: { serviceName } } = this.props
    const serviceRef = database().ref('services')
    await serviceRef.orderByChild('stationId')
      .equalTo(id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const services = Object.values(snapshot.val())
          this.setState({
            services,
            selectedServices: services.filter(service => service.name === serviceName)
          }, () => this.totalSalcserviceFee())
        }
      })
  }

  fetchReviews = async () => {
    const { station: { id } } = this.props
    const reviewRef = database().ref('reviews')
    await reviewRef.orderByChild('stationId')
      .equalTo(id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.setState({
            reviews: Object.values(snapshot.val())
          })
        }
      })
  }

  totalSalcserviceFee = () => {
    const { selectedServices } = this.state
    this.setState({
      totalServiceFee: selectedServices.reduce((totalServiceFee, service) => totalServiceFee + parseInt(service.price), 0)
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props
    Linking.openURL(`google.navigation:q=${station?.coords?.latitude},${station?.coords?.longitude}`)
  }

  handleServicePressed = service => {
    let { selectedServices } = this.state
    if (selectedServices.find(s => s.id === service.id)) {
      selectedServices = selectedServices.filter(s => s.id !== service.id)
    } else {
      selectedServices.push(service)
    }
    this.setState({ selectedServices }, () => this.totalSalcserviceFee())
  }

  handleChangeAmbulatoryOption = (useAmbulatory) => {
    const { distance, hasAmbulatory } = this.props.station
    console.log("StationModal -> handleChangeAmbulatoryOption -> this.props.station", this.props.station)
    if (hasAmbulatory) {
      this.setState({ ambulatoryFee: useAmbulatory ? distance * 8 : 0 }, () => this.props.onChangeAmbulatory(useAmbulatory))
    } else {
      alert("Rất tiếc, tiệm sửa xe này không có dịch vụ này!")
    }
  }

  handleBooking = () => {
    const { selectedServices, totalServiceFee, ambulatoryFee } = this.state
    const { auth: { user }, options: { useAmbulatory, userLocation }, station } = this.props
    const orderRef = database().ref('orders')
    const key = orderRef.child(station.id).push().key
    const order = {
      id: key,
      userId: user.uid,
      user: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        location: userLocation,
        deviceToken: user.deviceToken
      },
      stationId: station.id,
      station: {
        name: station.name,
        deviceToken: station.deviceToken
      },
      services: selectedServices,
      distance: station.distance,
      useAmbulatory,
      ambulatoryFee,
      totalServiceFee,
      totalBill: totalServiceFee + ambulatoryFee,
      status: OrderStatus.waiting,
      createdAt: database.ServerValue.TIMESTAMP
    }
    orderRef.child(key).update(order)
  }

  renderServiceItem = service => {
    const { selectedServices } = this.state
    return <TouchableOpacity
      style={[styles.service, { borderColor: selectedServices.find(s => s.id === service.id) ? APP_COLOR : '#E9EBEE' }]}
      onPress={() => this.handleServicePressed(service)}
    >
      <View>
        <Text>{service.name}</Text>
        <Text>{service.price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ</Text>
      </View>
      {this.renderVehicleIcon(service.vehicle)}
    </TouchableOpacity>
  }

  renderVehicleIcon = vehicle => {
    switch (vehicle) {
      case Vehicle.bike:
        return <Icon
          type="material-community"
          name="bike"
        />
      case Vehicle.car:
        <Icon
          type="material-community"
          name="car"
        />
      default:
        return <Icon
          type="material-community"
          name="motorbike"
          size={30}
        />
    }
  }

  render() {
    const { station, options: { useAmbulatory } } = this.props
    const { loading, services, selectedServices, totalServiceFee, ambulatoryFee, reviews } = this.state
    return (
      <View style={{ flex: 1 }}>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{station.name}</Text>
          <Icon type="material-community" name="directions" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.openOnGoogleMaps} />
        </View>
        {loading ? <Loading message='Đang tải...' /> :
          <>
            <View style={{ flex: 1 }}>
              <View style={styles.container}>
                <Text style={styles.heading}>{`Dịch vụ hiện có:`.toUpperCase()}</Text>
                <FlatList
                  data={services}
                  numColumns={2}
                  renderItem={({ item }) => this.renderServiceItem(item)}
                  ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
                />
              </View>
              <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.heading}>{`Dịch vụ đã chọn:`.toUpperCase()}</Text>
                  {selectedServices.length > 0 ? <Text onPress={() => this.setState({ selectedServices: [] }, () => this.totalSalcserviceFee())}>Xóa hết</Text> : null}
                </View>
                <FlatList
                  data={selectedServices}
                  numColumns={2}
                  renderItem={({ item }) => this.renderServiceItem(item)}
                  ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
                />
              </View>
            </View>
            <View style={{ padding: 10, paddingRight: 20, backgroundColor: '#e9ebee' }}>
              <ToggleSwitch
                isOn={useAmbulatory}
                onColor="green"
                offColor="red"
                label={`Sử dụng lưu động (${ambulatoryFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ)`}
                labelStyle={{ flex: 1, fontSize: 16 }}
                size="medium"
                onToggle={() => {
                  this.handleChangeAmbulatoryOption(!useAmbulatory)
                  setTimeout(() => this.totalSalcserviceFee(), 1000)
                }}
              />
              <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Tổng cộng: {(totalServiceFee + (useAmbulatory && selectedServices.length > 0 ? ambulatoryFee : 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ</Text>
            </View>
            <TouchableOpacity
              disabled={selectedServices.length > 0 ? false : true}
              style={{
                paddingVertical: 18,
                backgroundColor: APP_COLOR,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 1
              }}
              onPress={this.handleBooking}
            >
              <Text style={{ fontSize: 18, color: '#fff' }}>{`Đặt dịch vụ`.toUpperCase()}</Text>
            </TouchableOpacity>
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