import React, { Component } from 'react'
import { StyleSheet, Linking, ScrollView } from 'react-native'
import { Card, ListItem, Icon, Header, Button } from 'react-native-elements'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import StepIndicator from 'react-native-step-indicator'
import { orderStatus, orderUncompletedLabels, orderCanceledLabels } from '../../constants/orderStatus'
import { connect } from 'react-redux'
import { cancelOrder } from '../../redux/orderRedux/actions'

class OrderDetailModal extends Component {

  handleCancelOrder = () => {
    const { id } = this.props.order
    this.props.onCancelOrder(id)
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props.order
    Linking.openURL(`google.navigation:q=${station?.latitude},${station?.longitude}`)
  }

  render() {
    const { order, ordering: { canceling } } = this.props
    const labels = Object.values(order.status == orderStatus.canceled ? orderCanceledLabels : orderUncompletedLabels);
    return (
      <>
        <Header
          leftComponent={<Icon
            type="antdesign"
            name="left"
            color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            onPress={this.handleCloseModal}
          />}
          centerComponent={{
            text: order.station?.name?.toUpperCase() || "",
            style: { color: '#fff', fontSize: 18 }
          }}
          rightComponent={[orderStatus.accepted, orderStatus.fixing].find(x => x == order.status) ? <Icon
            type="material-community"
            name="directions"
            color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            onPress={this.openOnGoogleMaps}
          /> : {}}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        <ScrollView>
          {/* ORDER INFORMATION */}
          <Card
            title="THÔNG TIN CUỐC XE"
            titleStyle={{ fontSize: 16, color: APP_COLOR }}
          >
            <ListItem
              title="Họ và Tên:"
              rightTitle={order?.customerName}
              rightTitleStyle={{ color: 'black' }}
              containerStyle={{ paddingVertical: 5 }}
              rightSubtitleStyle={{ textAlign: "left" }}
            />
            <ListItem
              title="Số điện thoại:"
              rightTitle={order?.customerPhone}
              rightTitleStyle={{ color: 'black' }}
              containerStyle={{ paddingVertical: 5 }}
              rightSubtitleStyle={{ textAlign: "left" }}
            />
            <ListItem
              title="Vị trí:"
              rightTitle={order?.address}
              rightTitleStyle={{ color: 'black' }}
              containerStyle={{ paddingVertical: 5 }}
              rightSubtitleStyle={{ textAlign: "left" }}
            />
            <ListItem
              title="Sử dụng lưu động:"
              rightTitle={order?.useAmbulatory ? "Có" : "Không"}
              rightTitleStyle={{ color: 'black' }}
              containerStyle={{ paddingVertical: 5 }}
              rightSubtitleStyle={{ textAlign: "left" }}
            />
          </Card>
          {/* SELECTED SERVICES */}
          <Card
            title="DỊCH VỤ ĐÃ CHỌN"
            titleStyle={{ fontSize: 16, color: APP_COLOR }}
            dividerStyle={{ height: 1 }}
          >
            {
              order?.services.map((service, i) => {
                return (
                  <ListItem
                    key={i}
                    roundAvatar
                    title={service.name}
                    rightTitle={service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
                  />
                );
              })
            }
            <ListItem
              roundAvatar
              title="Tổng cộng:"
              titleStyle={styles.totalPrice}
              rightTitleStyle={[styles.totalPrice, { width: '100%' }]}
              rightTitle={order?.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
            />
          </Card>
          {/* ORDER STATUS */}
          <Card
            title="TÌNH TRẠNG CUỐC XE"
            titleStyle={{ fontSize: 16, color: APP_COLOR }}
            containerStyle={{ marginBottom: 15 }}
          >
            <StepIndicator
              customStyles={customStyles}
              stepCount={labels.length}
              currentPosition={labels.indexOf(order?.status)}
              labels={labels}
            />
            {order.status !== orderStatus.canceled && order.status === orderStatus.done && <Button
              title="ĐÁNH GIÁ"
              loading={false}
              containerStyle={{ marginTop: 10 }}
              buttonStyle={{ paddingVertical: 15 }}
              onPressOut={this.handleReview}
            />}

            {order.status !== orderStatus.canceled && order.status !== orderStatus.done && <Button
              title="HUỶ CUỐC XE"
              loading={canceling}
              containerStyle={{ marginTop: 10 }}
              buttonStyle={{ paddingVertical: 15 }}
              onPressOut={this.handleCancelOrder}
            />}
          </Card>
        </ScrollView>
      </>
    )
  }
}

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: APP_COLOR,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: APP_COLOR,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: APP_COLOR,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: APP_COLOR,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: APP_COLOR,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: APP_COLOR,
  labelSize: 13,
  currentStepLabelColor: APP_COLOR
}

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
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: APP_COLOR
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth,
    ordering: state.ordering
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCancelOrder: (id) => dispatch(cancelOrder(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailModal)