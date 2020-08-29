import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon, ListItem, Image, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { logout } from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'
import CustomIcon from '../../components/CustomIcon'
import Navigator from '../../utils/Navigator'
import PhoneFormater from '../../utils/PhoneFormater'

const logo = require('../../assets/images/app_logo_image.png')
const drawerBackground = require('../../assets/images/drawer-bg.jpg')
const avatar = require('../../assets/images/avatar.jpg')

class SideMenu extends Component {

  handleCloseSideMenu = () => {
    Navigator.toggleSideMenu(this.props.componentId, false)
  };

  handleOpenProfile = () => {
    this.handleCloseSideMenu()
    Navigator.showModal('ProfileScreen')
  }

  handleOpenOrderHistory = () => {
    this.handleCloseSideMenu()
    Navigator.showModal('OrderListModal')
  }

  handleOpenSettings = () => {
    this.handleCloseSideMenu()
    Navigator.showOverlay({ title: 'Opps', message: 'Chức năng này đang được phát triển!' })
  }

  render() {
    const { user } = this.props.auth
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF', width: '90%' }}>
        <View style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}>
          <CustomIcon onPress={this.handleCloseSideMenu}>
            <Icon
              type="evilicons"
              name="close"
              color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            />
          </CustomIcon>
        </View>
        <View
          style={{ height: 200, backgroundColor: APP_COLOR }}
          onTouchStart={this.handleOpenProfile}
        >
          <Image source={drawerBackground} style={{ height: 200 }} />
          <View
            style={{
              position: "absolute",
              left: 0, bottom: 0,
              width: '100%',
              padding: 20
            }}
          >
            <Avatar
              rounded
              source={avatar}
              size={70}
            />
            <View style={{ flexDirection: "row", paddingVertical: 5 }}>
              <Text style={{ color: "white", fontSize: 18 }}>{user?.name?.toUpperCase() || ""}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon
                type="feather"
                name="phone"
                color="white"
                size={16}
              />
              <Text style={{ color: "white", marginHorizontal: 10 }}>{PhoneFormater.display(user?.phoneNumber || "")}</Text>
              <Icon
                type="octicon"
                name={user?.phoneNumberConfirmed ? "verified" : "unverified"}
                color="white"
                size={16}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ListItem
            leftIcon={<Icon
              type="feather"
              name="user"
            />}
            title="Trang cá nhân"
            onPress={this.handleOpenProfile}
            bottomDivider
          />
          <ListItem
            leftIcon={<Icon
              type="feather"
              name="list"
            />}
            title="Lịch sử cuốc xe"
            onPress={this.handleOpenOrderHistory}
            bottomDivider
          />
          <ListItem
            leftIcon={<Icon
              type="feather"
              name="settings"
            />}
            title="Cài đặt"
            onPress={this.handleOpenSettings}
            bottomDivider
          />
          <ListItem
            leftIcon={<Icon
              type="feather"
              name="log-out"
            />}
            title="Đăng xuất"
            onPress={this.props.onLogout}
            bottomDivider
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: '#e8e8e8' }}>
          <Text style={{ fontSize: 15 }}>Powered by: Tuesday Team</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#e9e9e9'
  }, menuTitle: {
    fontSize: 15,
    paddingLeft: 10
  }
})