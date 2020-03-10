import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { APP_COLOR } from '../../utils/AppSettings'
import { Icon } from 'react-native-elements'
import { Navigation } from 'react-native-navigation';

export default class StationModal extends Component {

  handleCloseModal = () => {
    Navigation.dismissModal(this.props.componentId)
  };

  render() {
    const { station } = this.props
    console.log("StationModal -> render -> station", station)
    return (
      <View>
        <View
          style={styles.header}
        >
          <Icon type="antdesign" name="left" color={APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white'} onPress={this.handleCloseModal} />
          <Text style={{ fontSize: 18, color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white' }}>{station.name}</Text>
          <View />
        </View>
        <Text>Station Modal</Text>
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
  }
})