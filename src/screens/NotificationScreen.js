import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../redux/notifyRedux/actions'
import callApi from '../utils/apiCaller'
import { Header, Icon, Card, ListItem, Badge } from 'react-native-elements'
import { APP_COLOR } from '../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import { animateFast } from '../configs/navigation'

class NotificationScreen extends Component {

  handleMarkAllAsRead = async () => {
    const { auth: { token }, notify: { notifications } } = this.props
    if (notifications.filter(x => !x.isSeen).length) {
      await callApi(`notifications`, 'PUT', null, token)
      this.props.onFetchNotifications()
    }
  }

  handleNotificationPressed = notify => {
    const { order } = notify
    Navigation.showModal({
      id: 'orderDetailModal',
      component: {
        name: 'OrderDetailModal',
        passProps: {
          order
        },
        options: animateFast
      }
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { loading, notifications } = this.props.notify
    return (
      <>
        <Header
          leftComponent={<Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />}
          centerComponent={{ text: "THÔNG BÁO", style: { color: '#fff', fontSize: 18 } }}
          rightComponent={<Icon type="entypo" name="unread" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleMarkAllAsRead} />}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        <Card containerStyle={{ flex: 1, marginBottom: 15 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={notifications}
            renderItem={({ item }) => <ListItem
              title={item.title}
              subtitle={item.body}
              rightIcon={!item.isSeen ? <Badge
                status="success"
              /> : {}}
              bottomDivider
              onPress={() => this.handleNotificationPressed(item)}
            />}
            keyExtractor={item => item.id}
            onRefresh={this.props.onFetchNotifications}
            refreshing={loading}
          />
        </Card>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    notify: state.notify
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchNotifications: () => dispatch(Actions.fetchNotifications())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)