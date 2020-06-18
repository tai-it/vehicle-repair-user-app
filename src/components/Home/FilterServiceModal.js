import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

class FilterServiceModal extends Component {
  render() {
    return (
      <View>
        <Text>FilterServiceModal</Text>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.options
  }
}

export default connect(mapStateToProps, null)(FilterServiceModal)