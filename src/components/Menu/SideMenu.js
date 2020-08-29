import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon, ListItem, Image, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { logout } from '../../redux/authRedux/actions'
import { changeDarkMode } from '../../redux/appRedux/actions'
import CustomIcon from '../../components/CustomIcon'
import Navigator from '../../utils/Navigator'
import PhoneFormater from '../../utils/PhoneFormater'
import ToggleSwitch from 'toggle-switch-react-native'

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
    const { auth: { user }, app: { isDarkMode, backgroundColor, textColor } } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', width: '90%' }}>
        <View style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}>
          <CustomIcon onPress={this.handleCloseSideMenu}>
            <Icon
              type="evilicons"
              name="close"
              color={textColor}
            />
          </CustomIcon>
        </View>
        <View
          style={{ height: 200, backgroundColor: backgroundColor }}
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
              type="material-community"
              name={isDarkMode ? "brightness-4" : "brightness-5"}
            />}
            title="Chế độ tối"
            rightElement={<ToggleSwitch
              isOn={isDarkMode}
              onColor={backgroundColor}
              offColor="grey"
              labelStyle={{ flex: 1, fontSize: 16 }}
              size="medium"
              onToggle={() => this.props.onChangeDarkMode(!isDarkMode)}
            />}
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
        <View style={{
          backgroundColor: backgroundColor,
          justifyContent: "center",
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 7,
          borderTopWidth: 1,
          borderColor: '#e8e8e8'
        }}>
          <Text style={{ fontSize: 15, color: 'white' }}>Powered by: Tuesday Team</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeDarkMode: (value) => dispatch(changeDarkMode(value)),
    onLogout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)