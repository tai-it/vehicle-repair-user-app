import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import database from '@react-native-firebase/database'

export default class FixerOrderList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    // const { user: { uid } } = this.props.auth
    const ordersRef = database().ref("orders")
    ordersRef.orderByChild("stationId")
      .equalTo("-M0vxiuVVFU-DlWetsMP") // Change this to station id from state
      .on("value", snapshot => {
        const orders = Object.values(snapshot.val())
        this.setState({ orders })
      })
  }

  render() {
    const { orders } = this.state
    return (
      <View>
        <Text>List Order</Text>
        <FlatList
          data={orders}
          renderItem={({ item }) => <Text>{item.status}</Text>}
        />
      </View>
    )
  }
}

// const mapState = state => {
//   return {
//     auth: state.auth
//   }
// }

// export default connect(mapState, null)(FixerOrderList)