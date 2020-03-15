import React, { Component } from 'react'
import { View, ActivityIndicator, StatusBar, Text } from 'react-native'
import { styles } from '../styles';

export default class Loading extends Component {
  render() {
    const { size, color, message, style } = this.props;
    return (
      <View
        style={
          style || {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
        <ActivityIndicator
          animating
          size={size || 'large'}
          color={color || '#5DC5DD'}
        />
        <Text style={styles.label}>{message || ''}</Text>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}