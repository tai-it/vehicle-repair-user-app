import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
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
        <TouchableOpacity
          style={{ padding: 10, borderColor: APP_COLOR, borderWidth: 1, borderRadius: 3, marginTop: 20, alignItems: "center", maxWidth: 100, alignSelf: "center" }}
          onPress={() => Linking.openURL(`google.navigation:q=${station.coords.latitude},${station.coords.longitude}`)}
        >
          <Text>Open Maps</Text>
        </TouchableOpacity>
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