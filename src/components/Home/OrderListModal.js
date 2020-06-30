import React, { Component } from 'react'
import { FlatList, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Header, ListItem, Card } from 'react-native-elements'
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { fetchOrders } from '../../redux/orderRedux/actions'
import { format } from 'date-fns'
import CustomIcon from '../CustomIcon'
import Navigator from '../../utils/Navigator'

class OrderListModal extends Component {

  handleLoadMore = () => {
    const { hasNextPage, pageIndex } = this.props.ordering
    if (hasNextPage) {
      this.props.onFetchOrders(pageIndex + 1)
    }
  }

  handleOnOrderPressed = order => {
    Navigator.showModal('OrderDetailModal', { order })
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { loading, orders, hasNextPage } = this.props.ordering
    return (
      <>
        <Header
          leftComponent={
            <CustomIcon onPress={this.handleCloseModal}>
              <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} />
            </CustomIcon>
          }
          centerComponent={{ text: "LỊCH SỬ HOẠT ĐỘNG", style: { color: '#fff', fontSize: 18 } }}
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
          {orders.length > 0 ? <FlatList
            data={orders}
            renderItem={({ item }) =>
              <ListItem
                key={item.id}
                title={item.address}
                subtitle={format(new Date(item.createdOn), "dd-MM-yyyy H:mma")}
                rightTitle={item.status}
                onPress={() => this.handleOnOrderPressed(item)}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.05}
            onEndReached={this.handleLoadMore}
            onRefresh={this.props.onFetchOrders}
            refreshing={orders.length > 0 ? false : loading}
            ListFooterComponent={() => {
              return hasNextPage && <Loading /> || <View style={{ height: 1, backgroundColor: "#e8e8e8" }} />
            }}
          /> :
            <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>Bạn chưa đặt cuốc xe nào</Text>
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
    ordering: state.ordering
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: pageIndex => dispatch(fetchOrders(pageIndex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderListModal)