import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated, Easing } from 'react-native'
import { Icon, Card, ListItem, Badge, Header } from 'react-native-elements'
import { connect } from 'react-redux'
import Navigator from '../utils/Navigator'
import PhoneFormater from '../utils/PhoneFormater'
import { format } from 'date-fns'
import { APP_COLOR } from '../utils/AppSettings'
import CustomIcon from '../components/CustomIcon'
import { orderStatus } from '../constants/orderStatus'

class ProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowCover: true,
      name: props.auth.user.name || "",
      email: props.auth.user.email || "",
      address: props.auth.user.address || "",
      isReachedTop: true,
      height: new Animated.Value(200),
      bottomLeftRadius: new Animated.Value(50),
      bottomRightRadius: new Animated.Value(185)
    }
  }

  componentDidUpdate(prevProps) {
    const { email, name, address } = this.props.auth.user
    if (prevProps.auth.user.name !== name || prevProps.auth.user.email !== email || prevProps.auth.user.address !== address) {
      this.setState({ name, email, address })
    }
  }

  handleHideCover = () => {
    Animated.timing(this.state.height, {
      toValue: 60,
      duration: 300,
      easing: Easing.linear
    }).start()
    Animated.timing(this.state.bottomLeftRadius, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear
    }).start()
    Animated.timing(this.state.bottomRightRadius, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear
    }).start()
    this.setState({ isShowCover: false })
  }

  handleShowCover = () => {
    Animated.timing(this.state.height, {
      toValue: 200,
      duration: 500,
      easing: Easing.linear
    }).start()
    Animated.timing(this.state.bottomLeftRadius, {
      toValue: 50,
      duration: 0,
      easing: Easing.linear
    }).start()
    Animated.timing(this.state.bottomRightRadius, {
      toValue: 185,
      duration: 0,
      easing: Easing.linear
    }).start()
    this.setState({ isShowCover: true })
  }

  isScrollToTop = ({ contentOffset }) => {
    const isReachedTop = contentOffset.y <= 0
    this.setState({ isReachedTop })
    // setTimeout(() => this.setState({ isReachedTop }), isReachedTop ? 300 : 0)
    return isReachedTop
  }

  handleOpenSettings = () => {
    console.log("Open settings")
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
    const { isShowCover, name, email, address, height, bottomLeftRadius, bottomRightRadius } = this.state
    const { user: { phoneNumber, createdOn, isActive, phoneNumberConfirmed, roles } } = this.props.auth
    const { orders } = this.props.ordering
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            height: height,
            width: "100%",
            backgroundColor: APP_COLOR,
            borderBottomLeftRadius: bottomLeftRadius,
            borderBottomRightRadius: bottomRightRadius
          }}
        >
          {isShowCover ?
            <>
              <View style={styles.topContainer}>
                <Text style={styles.name}>{name || ""}</Text>
                <View style={styles.rowContainer}>
                  <Badge status={isActive ? "success" : "error"} />
                  <Text style={styles.status}>{isActive ? "Đang hoạt động" : "Đang tạm khoá"}</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Icon
                    type="feather"
                    name="phone"
                    color="white"
                    size={16}
                  />
                  <Text style={styles.phoneNumber}>{PhoneFormater.display(phoneNumber) || ""}</Text>
                  <Icon
                    type="octicon"
                    name={phoneNumberConfirmed ? "verified" : "unverified"}
                    color="white"
                    size={16}
                  />
                </View>
              </View>

              {/* BACK BUTTON */}
              <TouchableOpacity
                style={styles.btnBack}
                onPress={this.handleCloseModal}
              >
                <Icon type="antdesign" name="left" color="white" />
              </TouchableOpacity>

              {/* SETTINGS BUTTON */}
              <TouchableOpacity
                style={styles.btnSettings}
                onPress={() => {
                  if (isShowCover) {
                    this.handleHideCover()
                  } else {
                    this.handleShowCover()
                  }
                }}
              >
                <Icon type="antdesign" name="setting" color="white" />
              </TouchableOpacity>
            </> :
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
                <CustomIcon onPress={() => {
                  if (isShowCover) {
                    this.handleHideCover()
                  } else {
                    this.handleShowCover()
                  }
                }}>
                  <Icon type="antdesign" name="setting" color="white" />
                </CustomIcon>
              }
              backgroundColor={APP_COLOR}
              containerStyle={{
                paddingHorizontal: 0,
                paddingTop: 0,
                height: 60
              }}
            />
          }
        </Animated.View>
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
                rightIcon={
                  <TouchableOpacity
                    onPress={this.handleOpenProfileUpdateModal}
                  >
                    <Icon type="antdesign" name="edit" color={APP_COLOR} />
                  </TouchableOpacity>
                }
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
    auth: state.auth,
    ordering: state.ordering
  }
}

export default connect(mapStateToProps, null)(ProfileScreen)