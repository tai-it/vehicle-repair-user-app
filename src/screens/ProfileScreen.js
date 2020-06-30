import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { APP_COLOR } from '../utils/AppSettings'
import { connect } from 'react-redux'
import Navigator from '../utils/Navigator'

class ProfileScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editable: false,
      name: props.auth.user.name || "",
      email: props.auth.user.email || "",
      address: props.auth.user.email || ""
    }
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  handleSaveChanges = async () => {
    // const { auth: { token } } = this.props
    // const { name, email, password } = this.state
    // Process to update
    this.setState({ editable: false })
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { name, email, address, editable } = this.state
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.cover}>

        </View>

        <TouchableOpacity
          style={styles.btnBack}
          onPress={this.handleCloseModal}
        >
          <Icon
            type="antdesign"
            name="left"
            color="white"
          />
        </TouchableOpacity>

        {editable ?
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={this.handleSaveChanges}
          >
            <Icon
              type="feather"
              name="save"
              color="white"
            />
          </TouchableOpacity> :
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => this.setState({ editable: true })}
          >
            <Icon
              type="simple-line-icon"
              name="pencil"
              color="white"
            />
          </TouchableOpacity>
        }

        <View style={{ padding: 15 }}>
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Ngọc Hoàng"
            returnKeyType="next"
            onSubmitEditing={() => this.refEmail.focus()}
            blurOnSubmit={false}
            value={name}
            editable={editable}
            autoCapitalize="words"
            onChangeText={name => this.onChangeText("name", name)}
            containerStyle={{ marginTop: 20 }}
            inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
            leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
          />

          <Input
            label="Email"
            placeholder="user@example.com"
            keyboardType='email-address'
            returnKeyType="next"
            ref={r => (this.refEmail = r)}
            onSubmitEditing={() => this.refAddress.focus()}
            blurOnSubmit={false}
            value={email}
            editable={editable}
            onChangeText={email => this.onChangeText("email", email)}
            containerStyle={{ marginTop: 20 }}
            inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
            leftIcon={{ type: 'feather', name: 'mail', color: "#aaaaaa" }}
          />

          <Input
            label="Địa chỉ"
            placeholder="45 Nguyen Van An, Hai Chau, Da Nang"
            leftIcon={{ type: 'feather', name: 'map-pin', color: "#aaaaaa" }}
            value={address}
            editable={editable}
            autoCapitalize="none"
            returnKeyType="done"
            ref={r => (this.refAddress = r)}
            onSubmitEditing={this.handleSaveChanges}
            blurOnSubmit={true}
            onChangeText={address => this.onChangeText("address", address)}
            containerStyle={{ marginTop: 20 }}
            inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  cover: {
    height: 250,
    backgroundColor: APP_COLOR
  },
  btnEdit: {
    zIndex: 1000,
    position: "absolute",
    height: 60,
    width: 60,
    top: 220,
    right: 10,
    backgroundColor: "rgb(254, 54, 97)",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 60
  },
  btnBack: {
    zIndex: 1000,
    position: "absolute",
    height: 40,
    width: 40,
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 40
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, null)(ProfileScreen)