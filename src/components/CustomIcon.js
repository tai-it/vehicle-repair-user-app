import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'

export default class CustomIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          margin: 0,
          height: 60,
          width: 60,
          justifyContent: "center"
        }}
        activeOpacity={0}
        onPress={this.props.onPress}
      >
        <>
          {this.props.children}
        </>
      </TouchableOpacity>
    )
  }
}
