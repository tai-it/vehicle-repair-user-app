import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { fetchNotifications } from '../redux/notifyRedux/actions'
import callApi from '../utils/apiCaller'
import { Header, Icon, Card, ListItem, Badge } from 'react-native-elements'
import { APP_COLOR } from '../utils/AppSettings'
import { Navigation } from 'react-native-navigation'
import { animatedSlow } from '../configs/navigation'
import Loading from '../components/Loading'
import { format } from 'date-fns'

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

  handleNotificationPressed = notify => {
    const { order } = notify
    Navigation.showModal({
      id: 'orderDetailModal',
      component: {
        name: 'OrderDetailModal',
        passProps: {
          order
        },
        options: animatedSlow
      }
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { loading, hasNextPage, notifications } = this.props.notify
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
        <Card containerStyle={{
          flex: 1,
          margin: 5,
          marginBottom: 5,
          paddingVertical: 0
        }}>
          <FlatList
            data={notifications}
            renderItem={({ item }) => <ListItem
              title={item.title}
              subtitle={`${item.body}\n\n${format(new Date(item.createdOn), "dd-MM-yyyy H:mma")}`}
              rightIcon={!item.isSeen ? <Badge
                status="success"
              /> : {}}
              bottomDivider
              onPress={() => this.handleNotificationPressed(item)}
            />}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.05}
            onEndReached={this.handleLoadMore}
            onRefresh={this.props.onFetchNotifications}
            refreshing={notifications.length > 0 ? false : loading}
            ListFooterComponent={() => {
              return hasNextPage && <Loading /> || null
            }}
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
    onFetchNotifications: pageIndex => dispatch(fetchNotifications(pageIndex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)