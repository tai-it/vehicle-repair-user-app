import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, Modal, ScrollView, TouchableOpacity, Picker, Switch } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'react-native-firebase'
import _ from 'lodash'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import { Alert } from 'react-native'
import { connect } from 'react-redux'
import { changeService, changeAmbulatory } from '../../redux/optionsRedux/actions'

class OptionsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: [],
      selectedService: '',
      useAmbulatory: false
    }
  }

  componentDidMount() {
    this.fetchServices()
  }

  componentDidUpdate(prevProps) {
    if (this.props.options.vehicle !== prevProps.options.vehicle) {
      this.fetchServices()
    }
  }

  fetchServices = () => {
    const serviceRef = firebase.database().ref('services')
    const { vehicle } = this.props.options
    serviceRef.orderByChild('vehicle')
      .equalTo(vehicle)
      .once('value').then(snapshot => {
        let services = []
        if (snapshot.val()) {
          services = _.uniqBy(Object.values(snapshot.val()), 'name')
          this.props.onChangeService(services[0].name)
        }
        this.setState({ services })
      })
  }

  handleSubmit = async () => {
    const { options: { vehicle, serviceName, useAmbulatory } } = this.props
    const serviceRef = firebase.database().ref('services')
    let stationIds = []
    await serviceRef.orderByChild('name')
      .equalTo(serviceName)
      .once('value')
      .then(snapshot => {
        const services = Object.values(snapshot.val())
        services.forEach(service => {
          if (service.vehicle === vehicle) {
            stationIds.push(service.stationId)
          }
        });
      })
    const stationRef = firebase.database().ref('stations')
    let stations = []
    for (const id of stationIds) {
      await stationRef.child(id).once('value').then(snapshot => stations.push(snapshot.val()))
    }
    if (useAmbulatory) {
      stations = stations.filter(station => station.hasAmbulatory)
    }
    this.props.onDismissModal()
    if (stations.length > 0) {
      Navigation.showModal({
        id: 'foundStationList',
        component: {
          name: 'StationListModal',
          passProps: {
            stations
          }
        }
      })
    } else {
      Alert.alert('Thông báo', 'Xin lỗi. Hiện không có tiệm nào hoạt động gần đây')
    }
  }

  render() {
    const { visible, options: { vehicle, serviceName, userLocation, useAmbulatory }, auth: { user } } = this.props
    const { services } = this.state
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={this.props.onDismissModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={this.props.onDismissModal}
          style={{
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: '#FFF',
                borderRadius: 5,
                width: '90%',
                maxHeight: '85%'
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: "center",
                  justifyContent: 'space-between',
                  padding: 15,
                  borderBottomWidth: 1,
                  borderColor: '#E9E9E9',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  backgroundColor: APP_COLOR
                }}>
                <View />
                <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>CHỌN DỊCH VỤ</Text>
                <Icon
                  type="EvilIcons"
                  name="close"
                  color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
                  onPress={this.props.onDismissModal}
                />
              </View>
              <ScrollView
                style={{ padding: 20 }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <Text style={{ fontSize: 15 }}>{user?.fullName || 'Anonymous'}</Text>
                <Text style={{ fontSize: 15 }}>Phương tiện: {vehicle || 'Unknown'}</Text>
                <Text style={{ fontSize: 15 }}>SĐT: {user?.phone || 'Unknown'}</Text>
                <Text style={{ fontSize: 15 }}>Vị trí: {userLocation.address}</Text>
                {services.length > 0 ? <>
                  <Text style={{ fontSize: 15 }}>Chọn loại dịch vụ:</Text>
                  <Picker
                    selectedValue={serviceName}
                    style={{
                      width: '100%',
                    }}
                    onValueChange={(serviceName, itemIndex) =>
                      this.props.onChangeService(serviceName)
                    }>
                    {services.map((service, index) => <Picker.Item key={index} label={service.name} value={service.name} />)}
                  </Picker>
                </> : <Text style={{ fontSize: 15 }}>Đang cập nhật dịch vụ</Text>}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Sử dụng lưu động</Text>
                  <Switch
                    value={useAmbulatory}
                    onValueChange={() => this.props.onChangeAmbulatory(!useAmbulatory)}
                  />
                </View>
              </ScrollView>
              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  backgroundColor: APP_COLOR,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  marginTop: 1
                }}
                onPress={this.handleSubmit}
              >
                <Text style={{ fontSize: 18, color: '#fff' }}>TÌM KIẾM</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
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
    onChangeService: service => dispatch(changeService(service)),
    onChangeAmbulatory: option => dispatch(changeAmbulatory(option))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsModal)