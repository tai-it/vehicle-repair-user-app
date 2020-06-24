import React, { Component } from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Icon, Header, ListItem, Card } from 'react-native-elements'
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { animatedMedium } from '../../configs/navigation'
import { fetchOrders } from '../../redux/orderRedux/actions'
import { format } from 'date-fns'

class OrderListModal extends Component {

  handleLoadMore = () => {
    const { hasNextPage, pageIndex } = this.props.ordering
    if (hasNextPage) {
      this.props.onFetchOrders(pageIndex + 1)
    }
  }

  handleOnOrderPressed = order => {
    Navigation.showModal({
      id: 'orderDetailModal',
      component: {
        name: 'OrderDetailModal',
        passProps: {
          order
        },
        options: animatedMedium
      }
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { loading, orders, hasNextPage } = this.props.ordering
    return (
      <>
        <Header
          leftComponent={<Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />}
          centerComponent={{ text: "LỊCH SỬ HOẠT ĐỘNG", style: { color: '#fff', fontSize: 18 } }}
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
            data={orders}
            renderItem={({ item }) =>
              <ListItem
                key={item.id}
                title={item.address}
                subtitle={format(new Date(item.createdOn), "dd-MM-yyyy H:mma")}
                rightTitle={item.status}
                bottomDivider
                onPress={() => this.handleOnOrderPressed(item)}
              />
            }
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.05}
            onEndReached={this.handleLoadMore}
            onRefresh={this.props.onFetchOrders}
            refreshing={orders.length > 0 ? false : loading}
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
    ordering: state.ordering
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: pageIndex => dispatch(fetchOrders(pageIndex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderListModal)