import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default class SwiperItem extends Component {
  render() {
    return (
      <View style={myStyles.container}>
        <Image style={myStyles.img} source={this.props.item.imgURL} />
        <Text style={myStyles.title}>{this.props.item.title}</Text>
        <Text style={myStyles.description}>{this.props.item.description}</Text>
        <TouchableOpacity
          style={this.props.item.isShowStartBtn ? myStyles.btn : myStyles.btn_hide}
          disabled={this.props.item.isShowStartBtn ? false : true}
          onPress={() => this.props.onButtonStartPressed()}>
          <Text style={[{ fontSize: 20 }]}>{this.props.item.isShowStartBtn && "Bắt đầu"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
  },
  title: {
    fontSize: 23,
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 19,
    marginTop: 10,
    color: '#A9A9A9',
    width: 350,
  },
  img: { width: 350, height: 350 },
  btn: {
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    padding: 10,
    width: 130,
    borderRadius: 3,
    marginTop: 100,
  },
  btn_hide: {
    alignItems: 'center',
    padding: 10,
    width: 130,
    marginTop: 100,
  },
});