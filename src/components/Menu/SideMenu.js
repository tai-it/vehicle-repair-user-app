import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Icon, Header } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'
import { options } from '../../configs/navigation'

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
  }

  render() {
    const { user } = this.props.auth
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF', width: '90%' }}>
        <Header
          centerComponent={{ text: user?.name.toUpperCase() || "", style: { color: '#fff', fontSize: 16, marginHorizontal: -30 } }}
          rightComponent={<Icon
            type="EvilIcons"
            name="close"
            color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'}
            onPress={this.handleCloseSideMenu}
          />}
          backgroundColor={APP_COLOR}
          containerStyle={{ paddingTop: 0, paddingHorizontal: 18, height: 60 }}
        />
        <View>
          <TouchableOpacity
            style={styles.menu}
            onPress={this.handleOpenProfile}
          >
            <Icon
              type="font-awesome"
              name="user-circle"
            />
            <Text style={styles.menuTitle}>Trang cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menu}
            onPress={this.handleOpenOrderHistory}
          >
            <Icon
              type="font-awesome"
              name="list-alt"
            />
            <Text style={styles.menuTitle}>Lịch sử</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menu}
            onPress={this.handleOpenSettings}
          >
            <Icon
              type="feather"
              name="settings"
            />
            <Text style={styles.menuTitle}>Cài đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menu}
            onPress={this.props.onLogout}
          >
            <Icon
              type="antdesign"
              name="logout"
            />
            <Text style={styles.menuTitle}>Đăng xuất</Text>
          </TouchableOpacity>
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
    onLogout: () => dispatch(Actions.logout())
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