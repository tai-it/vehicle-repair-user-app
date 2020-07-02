import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Header, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import { logout } from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'
import CustomIcon from '../../components/CustomIcon'
import Navigator from '../../utils/Navigator'

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
        <Header
          centerComponent={{ text: user?.name.toUpperCase() || "", style: { color: '#fff', fontSize: 18, marginLeft: -30 } }}
          rightComponent={
            <CustomIcon onPress={this.handleCloseSideMenu}>
              <Icon
                type="evilicons"
                name="close"
                color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
              />
            </CustomIcon>
          }
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
            height: 60
          }}
        />
        <View>
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