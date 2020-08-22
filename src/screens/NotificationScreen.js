import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { fetchNotifications } from '../redux/notifyRedux/actions'
import callApi from '../utils/apiCaller'
import { Header, Icon, Card, ListItem, Badge } from 'react-native-elements'
import { APP_COLOR } from '../utils/AppSettings'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import CustomIcon from '../components/CustomIcon'
import Navigator from '../utils/Navigator'
import { NotiTypes } from '../constants/notificationType'

class NotificationScreen extends Component {

  handleMarkAllAsRead = async () => {
    const { auth: { token }, notify: { notifications } } = this.props
    if (notifications.filter(x => !x.isSeen).length) {
      await callApi(`notifications`, 'PUT', null, token)
      this.props.onFetchNotifications()
    }
  }

  handleLoadMore = () => {
    const { hasNextPage, pageIndex } = this.props.notify
    if (hasNextPage) {
      this.props.onFetchNotifications(pageIndex + 1)
    }
  }

  handleNotificationPressed = async notify => {
    if (notify.type === NotiTypes.orderTracking) {
      try {
        const { token } = this.props.auth
        const response = await callApi(`notifications/${notify.id}`, 'GET', null, token)
        const { order } = response.data
        Navigator.showModal('OrderDetailModal', { order })
      } catch (e) {
        console.log(e?.response)
      }
    } else {
      console.log(notify)
    }
    this.props.onFetchNotifications()
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { loading, hasNextPage, notifications } = this.props.notify
    return (
      <>
        <Header
          leftComponent={
            <CustomIcon onPress={this.handleCloseModal}>
              <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} />
            </CustomIcon>
          }
          centerComponent={{ text: "THÔNG BÁO", style: { color: '#fff', fontSize: 18 } }}
          rightComponent={
            <CustomIcon onPress={this.handleMarkAllAsRead}>
              <Icon type="entypo" name="unread" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} />
            </CustomIcon>
          }
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
            height: 60
          }}
        />
        <Card containerStyle={{
          flex: 1,
          margin: 5,
          marginBottom: 5,
          padding: 0
        }}>
          {notifications.length > 0 ? <FlatList
            data={notifications}
            renderItem={({ item }) => <ListItem
              title={item.title}
              subtitle={`${item.body}\n\n${format(new Date(item.createdOn), "dd-MM-yyyy H:mm")}`}
              rightIcon={!item.isSeen ? <Badge
                status="success"
              /> : {}}
              onPress={() => this.handleNotificationPressed(item)}
            />}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.05}
            onEndReached={this.handleLoadMore}
            onRefresh={this.props.onFetchNotifications}
            refreshing={notifications.length > 0 ? false : loading}
            ListFooterComponent={() => {
              return hasNextPage && <Loading /> || <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />
            }}
          /> :
            <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>Bạn không có thông báo nào</Text>
            </View>
          }
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
    onFetchNotifications: pageIndex => dispatch(fetchNotifications(pageIndex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)