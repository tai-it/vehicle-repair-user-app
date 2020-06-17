import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default class SearchLocationModal extends Component {
  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          query={{
            key: "AIzaSyC5_5R7U9OrXn478uXviYcSRELdkeP3QMI",
            language: 'vi',
          }}
          onPress={(data, details = null) => console.log(data)}
          onFail={error => console.error(error)}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});