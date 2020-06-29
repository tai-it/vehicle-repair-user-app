import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Header, ListItem } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { logout } from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'
import { options } from '../../configs/navigation'
import CustomIcon from '../../components/CustomIcon'

class SideMenu extends Component {

  handleCloseSideMenu = () => {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  };

  handleOpenProfile = () => {
    this.handleCloseSideMenu()
    Navigation.showModal({
      id: 'profileScreen',
      component: {
        name: 'ProfileScreen',
        options
      }
    })
  }

  handleOpenOrderHistory = () => {
    this.handleCloseSideMenu()
    Navigation.showModal({
      id: 'orderListModal',
      component: {
        name: 'OrderListModal',
        options
      }
    })
  }

  handleOpenSettings = () => {
    this.handleCloseSideMenu()
    alert("Chưa làm. OK")
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