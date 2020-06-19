import React, { Component } from 'react'
import { View, StyleSheet, Text, Linking } from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements';
import Loading from '../Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { Navigation } from 'react-native-navigation';

export default class OrderDetailModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      station: null,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwODU4MjIyOTU3IiwianRpIjoiM2YyMGNmMTQtYzQ4MC00YzQ4LThjNzUtY2Y2NGZlMjdmM2Q1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIwODU4MjIyOTU3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImV4cCI6MTU5MzgzMTMwMywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMzMxIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMzMxIn0.9bRA6iiNcAgsKb8H401njRt70NAMzYOoE6hDuUdrnQU",
      order: {
        userId: "37c58c36-084f-4a25-80fb-d041bfa96b2b",
        customerName: "Trần Văn Tài",
        customerPhone: "0858222957",
        stationId: "a7df32f3-c813-49bf-a244-1c0af372a9af",
        services: [
          {
            id: "1b2ac1f1-1690-4db9-bb9d-0ab8a7f2d162",
            name: "Thay lốp",
            description: null,
            thumbnail: null,
            price: 200000,
            stationId: "a7df32f3-c813-49bf-a244-1c0af372a9af"
          },
          {
            id: "542a4b1b-920d-4420-91e2-c8e1f99fb87a",
            name: "Vá xe",
            description: null,
            thumbnail: null,
            price: 20000,
            stationId: "a7df32f3-c813-49bf-a244-1c0af372a9af"
          },
          {
            id: "16934223-6cf0-4d4a-9510-23f8cf405568",
            name: "Dán decal",
            description: null,
            thumbnail: null,
            price: 450000,
            stationId: "a7df32f3-c813-49bf-a244-1c0af372a9af"
          }
        ],
        id: "33bd8c0d-22b1-4d84-975c-bd9d0e7f5825",
        address: "220 Nguyễn Hữu Thọ, Hoà Cường Bắc, Hải Châu, Đà Nẵng 550000, Vietnam",
        latitude: 16.0420349666434,
        longitude: 108.21025578305125,
        distance: 823,
        useAmbulatory: false,
        ambulatoryFee: 0,
        totalPrice: 670000,
        status: "Đang chờ"
      }
    }
  }

  componentDidMount = async () => {
    await this.fetchStationDetail()
  }

  fetchStationDetail = async () => {
    const { stationId } = this.state.order
    const response = await callApi(`stations/${stationId}`)
    this.setState({
      station: response.data,
      loading: false
    })
  }

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  openOnGoogleMaps = () => {
    const { station } = this.props
    Linking.openURL(`google.navigation:q=${station?.latitude},${station?.longitude}`)
  }

  render() {
    const { order, station, loading } = this.state
    return (
      <View>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{station?.name?.toUpperCase() || ""}</Text>
          <Icon type="material-community" name="directions" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.openOnGoogleMaps} />
        </View>
        {loading ? <Loading
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: '90%'
          }}
          message="Đang tải thông tin" /> :
          <>
            <Card
              title="DỊCH VỤ"
              titleStyle={{ fontSize: 18, color: APP_COLOR }}
              dividerStyle={{ height: 2, backgroundColor: APP_COLOR }}
            >
              {
                order?.services.map((service, i) => {
                  return (
                    <ListItem
                      key={i}
                      roundAvatar
                      title={service.name}
                      rightTitle={service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
                    />
                  );
                })
              }
              <ListItem
                roundAvatar
                title="Tổng cộng:"
                titleStyle={styles.totalPrice}
                rightTitleStyle={[styles.totalPrice, { width: '100%' }]}
                rightTitle={order?.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"}
              />
            </Card>
          </>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: APP_COLOR
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: APP_COLOR
  }
})
