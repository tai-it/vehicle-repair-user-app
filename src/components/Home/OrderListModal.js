import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Icon, Header, ListItem } from 'react-native-elements'
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { animatedMedium } from '../../configs/navigation'
import callApi from '../../utils/apiCaller'

class OrderListModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      orders: []
    }
  }

  componentDidMount = async () => {
    await this.fetchOrders()
  }

  fetchOrders = async () => {
    const { token } = this.props.auth
    try {
      const response = await callApi('orders/me?isDesc=true', 'GET', null, token)
      const orders = response?.data?.sources
      this.setState({
        loading: false,
        orders
      })
    } catch (e) {
      console.log(e?.response);
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
    const { loading, orders } = this.state
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
        {loading ? <Loading
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: '90%'
          }}
          message="Đang tải thông tin" /> :
          <FlatList
            data={orders}
            renderItem={({ item }) =>
              <ListItem
                key={item.id}
                title={item.address}
                rightSubtitle={item.status}
                bottomDivider
                onPress={() => this.handleOnOrderPressed(item)}
              />
            }
          />
        }
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, null)(OrderListModal)