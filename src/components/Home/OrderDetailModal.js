import React, { Component } from 'react'
import { StyleSheet, Linking, ScrollView } from 'react-native'
import { Card, ListItem, Icon, Header, Button } from 'react-native-elements'
import StepIndicator from 'react-native-step-indicator'
import { orderStatus, orderUncompletedLabels, orderCanceledLabels, orderRejectedLabels } from '../../constants/orderStatus'
import { connect } from 'react-redux'
import { cancelOrder } from '../../redux/orderRedux/actions'
import CustomIcon from '../CustomIcon'
import Navigator from '../../utils/Navigator'

class OrderDetailModal extends Component {

  handleCancelOrder = () => {
    const { id } = this.props.order
    this.props.onCancelOrder(id)
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props.order
    Linking.openURL(`google.navigation:q=${station?.latitude},${station?.longitude}`)
  }

  render() {
    const { order, ordering: { canceling }, app: { backgroundColor, textColor } } = this.props
    const labels = Object.values(order.status == orderStatus.canceled ? orderCanceledLabels : (order.status == orderStatus.rejected ? orderRejectedLabels : orderUncompletedLabels));
    return (
      <>
        {/* HEADER */}
        <Header
          leftComponent={
            <CustomIcon
              onPress={this.handleCloseModal}
            >
              <Icon
                type="antdesign"
                name="left"
                color={textColor}
              />
            </CustomIcon>
          }
          centerComponent={{
            text: order.station?.name?.toUpperCase() || "",
            style: { color: '#fff', fontSize: 18 }
          }}
          rightComponent={[orderStatus.accepted, orderStatus.fixing].find(x => x == order.status) ?
            <CustomIcon
              onPress={this.openOnGoogleMaps}
            >
              <Icon
                type="material-community"
                name="directions"
                color={textColor}
              />
            </CustomIcon>
            : {}
          }
          backgroundColor={backgroundColor}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
            height: 60
          }}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* ORDER INFORMATION */}
          <Card
            title="THÔNG TIN CUỐC XE"
            titleStyle={Object.assign({ color: backgroundColor }, styles.cardTitle)}
            containerStyle={{
              flex: 1,
              margin: 5
            }}
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
            titleStyle={Object.assign({ color: backgroundColor }, styles.cardTitle)}
            containerStyle={{
              flex: 1,
              margin: 5
            }}
            dividerStyle={{ height: 1 }}
          >
            {
              order?.services.map((service, i) => {
                return (
                  <ListItem
                    key={i}
                    title={service.name}
                    rightTitle={service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
                    rightTitleStyle={{ color: 'black' }}
                  />
                );
              })
            }
            <ListItem
              title="Phí lưu động"
              rightTitle={order?.ambulatoryFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
              rightTitleStyle={{ color: 'black' }}
            />
            <ListItem
              title="Tổng cộng:"
              titleStyle={[styles.totalPrice, { color: 'black' }]}
              rightTitleStyle={[styles.totalPrice, { color: 'black', width: '100%' }]}
              rightTitle={order?.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
            />
          </Card>
          {/* ORDER STATUS */}
          <Card
            title="TÌNH TRẠNG CUỐC XE"
            titleStyle={Object.assign({ color: backgroundColor }, styles.cardTitle)}
            containerStyle={{
              flex: 1,
              margin: 5,
              marginBottom: 5
            }}
          >
            <StepIndicator
              customStyles={Object.assign(customStyles, {
                stepStrokeCurrentColor: backgroundColor,
                stepStrokeFinishedColor: backgroundColor,
                separatorFinishedColor: backgroundColor,
                stepIndicatorFinishedColor: backgroundColor,
                stepIndicatorCurrentColor: backgroundColor,
                labelColor: backgroundColor,
                currentStepLabelColor: backgroundColor
              })}
              stepCount={labels.length}
              currentPosition={labels.indexOf(order?.status)}
              labels={labels}
            />

            {order.status !== orderStatus.canceled && order.status === orderStatus.done && <Button
              title="ĐÁNH GIÁ"
              loading={false}
              containerStyle={{ marginTop: 10 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: backgroundColor }}
              onPressOut={this.handleReview}
            />}

            {order.status !== orderStatus.canceled && order.status !== orderStatus.rejected && order.status !== orderStatus.done && <Button
              title="HUỶ CUỐC XE"
              loading={canceling}
              containerStyle={{ marginTop: 10 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: backgroundColor }}
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
  stepStrokeWidth: 3,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelSize: 13
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    marginBottom: 0,
    paddingBottom: 15
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold"
  }
})

const mapStateToProps = state => {
  return {
    app: state.app,
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