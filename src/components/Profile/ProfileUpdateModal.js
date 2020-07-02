import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'
import { updateProfileRequest, changePasswordRequest } from '../../redux/authRedux/actions'
import { Card, Input, Header, Icon, Button } from 'react-native-elements'
import CustomIcon from '../CustomIcon'
import { APP_COLOR } from '../../utils/AppSettings'
import Navigator from '../../utils/Navigator'

class ProfileUpdateModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: props.auth.user.name || "",
      email: props.auth.user.email || "",
      address: props.auth.user.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  }

  componentDidUpdate(prevProps) {
    const { email, name, address } = this.props.auth.user
    if (prevProps.auth.user.name !== name || prevProps.auth.user.email !== email || prevProps.auth.user.address !== address) {
      this.setState({ name, email, address })
    }
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  handleSaveUpdateProfile = () => {
    this.props.onClearErrorState()
    const { name, email, address } = this.state
    const { auth: { user } } = this.props
    if (name !== user.name || email !== user.email || address !== user.address) {
      this.props.onUpdateProfile(email.length > 0 ? { name, email, address } : { name, address })
    }
  }

  handleChangePassword = () => {
    this.props.onClearErrorState()
    const { currentPassword, newPassword, confirmPassword } = this.state
    if (newPassword === confirmPassword) {
      this.props.onChangePassword({ currentPassword, newPassword })
    }
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { name, email, address, currentPassword, newPassword, confirmPassword } = this.state
    const { auth: { errors, isUpdatingProfile, isChangingPassword } } = this.props
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <CustomIcon onPress={this.handleCloseModal}>
              <Icon type="antdesign" name="left" color='white' />
            </CustomIcon>
          }
          centerComponent={{
            text: "CẬP NHẬT THÔNG TIN",
            style: {
              color: '#fff',
              fontSize: 18,
              marginHorizontal: -30
            }
          }}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
            height: 60
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Card>
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Ngọc Hoàng"
              returnKeyType="next"
              onSubmitEditing={() => this.refAddress.focus()}
              blurOnSubmit={false}
              value={name}
              autoCapitalize="words"
              onChangeText={name => this.onChangeText("name", name)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
              errorMessage={errors?.find(x => x.propertyName == "Name")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Địa chỉ"
              placeholder="6x Tên đường, Tên quận, Tên thành phố"
              leftIcon={{ type: 'feather', name: 'map-pin', color: "#aaaaaa" }}
              value={address}
              autoCapitalize="none"
              returnKeyType="next"
              ref={r => (this.refAddress = r)}
              onSubmitEditing={() => this.refEmail.focus()}
              blurOnSubmit={false}
              onChangeText={address => this.onChangeText("address", address)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              errorMessage={errors?.find(x => x.propertyName == "Address")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Email"
              placeholder="user@example.com"
              keyboardType='email-address'
              returnKeyType="done"
              autoCapitalize={false}
              ref={r => (this.refEmail = r)}
              onSubmitEditing={this.handleSaveUpdateProfile}
              blurOnSubmit={true}
              value={email}
              onChangeText={email => this.onChangeText("email", email)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              leftIcon={{ type: 'feather', name: 'mail', color: "#aaaaaa" }}
              errorMessage={errors?.find(x => x.propertyName == "Email")?.errorMessage.split(";")[0] || ""}
            />
            <Button
              title="CẬP NHẬT"
              loading={isUpdatingProfile}
              disabled={isChangingPassword}
              containerStyle={{ paddingTop: 15 }}
              buttonStyle={styles.btn}
              onPress={this.handleSaveUpdateProfile}
            />
          </Card>
          <Card containerStyle={{ marginBottom: 15 }}>
            <Input
              label="Mật khẩu hiện tại"
              placeholder="********"
              returnKeyType="next"
              onSubmitEditing={() => this.refNewPassword.focus()}
              blurOnSubmit={false}
              value={currentPassword}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={currentPassword => this.onChangeText("currentPassword", currentPassword)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              leftIcon={{ type: 'MaterialCommunityIcons', name: 'security', color: "#aaaaaa" }}
              errorMessage={errors?.find(x => x.propertyName == "CurrentPassword")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Mật khẩu mới"
              placeholder="********"
              leftIcon={{ type: 'MaterialCommunityIcons', name: 'security', color: "#aaaaaa" }}
              value={newPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              ref={r => (this.refNewPassword = r)}
              onSubmitEditing={() => this.refConfirmPassword.focus()}
              blurOnSubmit={false}
              onChangeText={newPassword => this.onChangeText("newPassword", newPassword)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              errorMessage={errors?.find(x => x.propertyName == "NewPassword")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Xác nhận mật khẩu"
              placeholder="********"
              returnKeyType="done"
              autoCapitalize="none"
              ref={r => (this.refConfirmPassword = r)}
              onSubmitEditing={this.handleChangePassword}
              blurOnSubmit={true}
              value={confirmPassword}
              secureTextEntry
              onChangeText={confirmPassword => this.onChangeText("confirmPassword", confirmPassword)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={styles.input}
              leftIcon={{ type: 'MaterialCommunityIcons', name: 'security', color: "#aaaaaa" }}
              errorMessage={newPassword === confirmPassword ? "" : "Mật khẩu không khớp"}
            />
            <Button
              title="ĐỔI MẬT KHẨU"
              loading={isChangingPassword}
              disabled={isUpdatingProfile}
              containerStyle={{ paddingTop: 15 }}
              buttonStyle={styles.btn}
              onPress={this.handleChangePassword}
            />
          </Card>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  bodyContent: {
    flex: 1,
    marginBottom: 15
  },
  btn: {
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#555555',
    fontSize: 16
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClearErrorState: () => dispatch({ type: CLEAR_ERROR_STATE }),
    onUpdateProfile: user => dispatch(updateProfileRequest(user)),
    onChangePassword: params => dispatch(changePasswordRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdateModal)