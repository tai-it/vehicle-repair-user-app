import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Icon, Card, ListItem, Header } from 'react-native-elements'
import { connect } from 'react-redux'
import Navigator from '../utils/Navigator'
import { format } from 'date-fns'
import CustomIcon from '../components/CustomIcon'
import { orderStatus } from '../constants/orderStatus'

class ProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.auth.user.name || "",
      email: props.auth.user.email || "",
      address: props.auth.user.address || "",
    }
  }

  componentDidUpdate(prevProps) {
    const { email, name, address } = this.props.auth.user
    if (prevProps.auth.user.name !== name || prevProps.auth.user.email !== email || prevProps.auth.user.address !== address) {
      this.setState({ name, email, address })
    }
  }

  handleOpenOrderListModal = () => {
    Navigator.showModal("OrderListModal")
  }

  handleOpenProfileUpdateModal = () => {
    Navigator.showModal("ProfileUpdateModal")
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { name, email, address } = this.state
    const { auth: { user: { phoneNumber, createdOn, roles } }, ordering: { orders }, app: { backgroundColor } } = this.props
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <CustomIcon onPress={this.handleCloseModal}>
              <Icon type="antdesign" name="left" color='white' />
            </CustomIcon>
          }
          centerComponent={{
            text: name.toUpperCase() || "",
            style: {
              color: '#fff',
              fontSize: 18,
              marginHorizontal: -30
            }
          }}
          rightComponent={
            <CustomIcon onPress={this.handleOpenProfileUpdateModal}>
              <Icon type="antdesign" name="edit" color='white' />
            </CustomIcon>
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
          {/* INFO */}
          <>
            <Card containerStyle={[styles.bodyContent, { marginBottom: 0 }]}>
              <ListItem
                leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
                title="Họ và tên"
                titleStyle={styles.title}
                subtitle={name}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'MaterialIcons', name: 'group', color: "#aaaaaa" }}
                title="Vai trò"
                titleStyle={styles.title}
                subtitle={roles[0]}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'map-pin', color: "#aaaaaa" }}
                title="Địa chỉ"
                titleStyle={styles.title}
                subtitle={address || "Chưa cập nhật"}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'mail', color: "#aaaaaa" }}
                title="Email"
                titleStyle={styles.title}
                subtitle={email || "Chưa cập nhật"}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'phone', color: "#aaaaaa" }}
                title="Số điện thoại"
                titleStyle={styles.title}
                subtitle={phoneNumber || "Chưa cập nhật"}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'user-plus', color: "#aaaaaa" }}
                title="Đăng ký ngày"
                titleStyle={styles.title}
                subtitle={format(new Date(createdOn), "dd-MM-yyyy H:mm")}
                subtitleStyle={styles.subtitle}
              />
            </Card>
            <Card containerStyle={styles.bodyContent}>
              <ListItem
                leftIcon={{ type: 'antdesign', name: 'barchart', color: "#aaaaaa" }}
                title="Đã đặt"
                titleStyle={styles.title}
                subtitle={`${orders.length || 0} cuốc`}
                subtitleStyle={styles.subtitle}
                onPress={this.handleOpenOrderListModal}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'MaterialIcons', name: 'cancel', color: "#aaaaaa" }}
                title="Đã huỷ"
                titleStyle={styles.title}
                subtitle={`${orders.filter(x => x.status === orderStatus.canceled).length || 0} cuốc`}
                subtitleStyle={styles.subtitle}
                onPress={this.handleOpenOrderListModal}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'MaterialIcons', name: 'done', color: "#aaaaaa" }}
                title="Hoàn thành"
                titleStyle={styles.title}
                subtitle={`${orders.filter(x => x.status === orderStatus.done || 0).length} cuốc`}
                subtitleStyle={styles.subtitle}
                onPress={this.handleOpenOrderListModal}
              />
            </Card>
          </>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cover: {
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 185
  },
  topContainer: {
    position: "absolute",
    bottom: 20,
    left: 25
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontSize: 25,
    color: "white"
  },
  status: {
    color: "white",
    padding: 5
  },
  phoneNumber: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 5
  },
  btnBack: {
    zIndex: 1001,
    position: "absolute",
    height: 40,
    width: 40,
    top: 10,
    left: 10,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 40
  },
  btnSettings: {
    zIndex: 1001,
    position: "absolute",
    height: 40,
    width: 40,
    top: 10,
    right: 10,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 40
  },
  bodyContent: {
    flex: 1,
    marginBottom: 15
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#555555',
    fontSize: 16
  },
  title: {
    fontSize: 16
  },
  subtitle: {
    fontSize: 16
  }
})

const mapStateToProps = state => {
  return {
    app: state.app,
    auth: state.auth,
    ordering: state.ordering
  }
}

export default connect(mapStateToProps, null)(ProfileScreen)