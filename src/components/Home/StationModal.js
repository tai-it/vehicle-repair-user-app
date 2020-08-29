import React, { Component } from 'react'
import { StyleSheet, Text, View, Linking, FlatList } from 'react-native'
import { Icon, CheckBox, Header, Card, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import ToggleSwitch from 'toggle-switch-react-native'
import { changeAmbulatory } from '../../redux/optionsRedux/actions'
import { addOrder } from '../../redux/orderRedux/actions'
import CustomIcon from '../CustomIcon'
import Navigator from '../../utils/Navigator'

class StationModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedServices: [],
      totalServiceFee: 0,
      ambulatoryFee: props.options.useAmbulatory ? props.station.distance * props.station.coefficient : 0
    }
  }

  componentDidMount() {
    const { options: { useAmbulatory }, station: { hasAmbulatory } } = this.props
    if (!hasAmbulatory && useAmbulatory) {
      this.props.onChangeAmbulatory(false)
    }
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

  totalSalcserviceFee = (selectedServices) => {
    this.setState({
      selectedServices,
      totalServiceFee: selectedServices.reduce((totalServiceFee, service) => totalServiceFee + parseInt(service.price), 0)
    })
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props
    Linking.openURL(`google.navigation:q=${station?.latitude},${station?.longitude}`)
  }

  handleChangeAmbulatoryOption = (useAmbulatory) => {
    const { distance, hasAmbulatory, coefficient } = this.props.station
    if (hasAmbulatory) {
      this.setState({ ambulatoryFee: useAmbulatory ? distance * coefficient : 0 }, () => {
        this.props.onChangeAmbulatory(useAmbulatory)
        this.totalSalcserviceFee(this.state.selectedServices)
      })
    } else {
      Navigator.showOverlay({ message: 'Rất tiếc, tiệm sửa xe này không có dịch vụ này!' })
    }
  }

  handleBooking = () => {
    const { selectedServices } = this.state
    if (selectedServices.length > 0) {
      const { station: { id, distance, isAvailable }, options: { userLocation: { address, coords }, useAmbulatory } } = this.props
      if (isAvailable) {
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
        this.props.onAddOrder(order)
      } else {
        Navigator.showOverlay({ message: 'Tiệm xe này hiện không khả dụng' })
      }
    }
  }

  getServiceTitle = service => {
    const { name, price } = service
    return `${name}\n${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
  }

  render() {
    const { options: { useAmbulatory }, ordering: { booking }, station, app: { backgroundColor, textColor } } = this.props
    const { selectedServices, totalServiceFee, ambulatoryFee } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <Header
          leftComponent={
            <CustomIcon onPress={this.handleCloseModal}>
              <Icon type="antdesign" name="left" color={textColor} />
            </CustomIcon>
          }
          centerComponent={{ text: station?.name?.toUpperCase() || "", style: { color: '#fff', fontSize: 18, marginHorizontal: -30 } }}
          backgroundColor={backgroundColor}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
            height: 60
          }}
        />
        <>
          <FlatList
            contentContainerStyle={{ paddingVertical: 5 }}
            data={station?.services}
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
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          />
          <Card containerStyle={{ margin: 0 }}>
            <ToggleSwitch
              isOn={useAmbulatory}
              onColor={backgroundColor}
              offColor="grey"
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
              buttonStyle={{ paddingVertical: 15, backgroundColor: backgroundColor }}
              onPress={this.handleBooking}
            />
          </Card>
        </>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    app: state.app,
    options: state.options,
    ordering: state.ordering
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeAmbulatory: option => dispatch(changeAmbulatory(option)),
    onAddOrder: order => dispatch(addOrder(order))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StationModal)