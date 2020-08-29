import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Overlay, Button } from 'react-native-elements'
import Navigator from '../utils/Navigator'
import { store } from '../redux/store'

export default class CustomAlert extends Component {

  handleClose = () => {
    Navigator.dismissOverlay(this.props.componentId)
  }

  handleShowOrders = () => {
    this.handleClose()
    Navigator.dismissAllModals()
    Navigator.showModal('OrderListModal')
  }

  render() {
    const { title, message, btnOK, btnShowOrders } = this.props
    const { backgroundColor } = store.getState().app
    return (
      <>
        <Overlay
          isVisible={true}
          windowBackgroundColor="rgba(0, 0, 0, .5)"
          overlayBackgroundColor="white"
          width="80%"
          height="auto"
          onBackdropPress={this.handleClose}
        >
          <Text style={styles.title}>{title || "Thông báo"}</Text>
          <Text style={styles.message}>{message || ""}</Text>
          <View style={styles.btnContainer}>
            {btnShowOrders && <Button
              title="Kiểm tra"
              buttonStyle={[styles.btn, { backgroundColor: backgroundColor }]}
              onPress={this.handleShowOrders}
            />}
            {btnOK && <Button
              title="Đồng ý"
              buttonStyle={[styles.btn, { backgroundColor: backgroundColor }]}
              onPress={this.props?.onBtnOKPress || this.handleClose}
            />}
            <Button
              title="Đóng"
              type="outline"
              buttonStyle={styles.btn}
              onPress={this.handleClose}
            />
          </View>
        </Overlay>
      </>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingHorizontal: 10
  },
  message: {
    fontSize: 16,
    padding: 10
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5
  }
})