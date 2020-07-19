import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import { APP_COLOR } from '../../utils/AppSettings'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'
import { Header, Card, Input, Button } from 'react-native-elements'
import { checkUserExists } from '../../redux/authRedux/actions'
import Navigator from '../../utils/Navigator'
import { sideMenu } from '../../configs/menu/sideMenu'

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isNavigated: false
    }
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  onSubmit = () => {
    const { name, phoneNumber, password, confirmPassword } = this.state
    if (name && phoneNumber && password === confirmPassword) {
      this.props.onCheckUserExistsRequest({ name, phoneNumber, password })
    }
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { name, phoneNumber, password, confirmPassword, isNavigated } = this.state
    const { loading, errors, authenticated } = this.props.auth
    if (authenticated) {
      if (!isNavigated) {
        this.setState({ isNavigated: true })
        Navigator.setRoot({
          sideMenu
        })
      }
      return <></>
    }
    return (
      <>
        <Header
          centerComponent={{ text: "ĐĂNG KÝ", style: { color: '#fff', fontSize: 18 } }}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        <Card containerStyle={{
          flex: 1,
          margin: 5,
          marginBottom: 5
        }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Ngọc Hoàng"
              returnKeyType="next"
              onSubmitEditing={() => this.refPhoneNumber.focus()}
              blurOnSubmit={false}
              value={name}
              autoCapitalize="words"
              onChangeText={name => this.onChangeText("name", name)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa", size: 20 }}
              errorMessage={errors?.find(x => x.propertyName == "Name")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Số điện thoại"
              placeholder="0987 654 321"
              keyboardType='phone-pad'
              returnKeyType="next"
              ref={r => (this.refPhoneNumber = r)}
              onSubmitEditing={() => this.refPassword.focus()}
              blurOnSubmit={false}
              value={phoneNumber}
              onChangeText={phoneNumber => this.onChangeText("phoneNumber", phoneNumber)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              leftIcon={{ type: 'feather', name: 'phone', color: "#aaaaaa", size: 20 }}
              errorMessage={errors?.find(x => x.propertyName == "PhoneNumber")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Mật khẩu"
              placeholder="**************"
              leftIcon={{ type: 'feather', name: 'lock', color: "#aaaaaa", size: 20 }}
              value={password}
              autoCapitalize="none"
              returnKeyType="next"
              ref={r => (this.refPassword = r)}
              onSubmitEditing={() => this.refConfirmPassword.focus()}
              blurOnSubmit={false}
              onChangeText={password => this.onChangeText("password", password)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              secureTextEntry={true}
              errorMessage={errors?.find(x => x.propertyName == "Password")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Xác nhận mật khẩu"
              placeholder="**************"
              leftIcon={{ type: 'feather', name: 'lock', color: "#aaaaaa", size: 20 }}
              value={confirmPassword}
              autoCapitalize="none"
              returnKeyType="done"
              ref={r => (this.refConfirmPassword = r)}
              onSubmitEditing={this.onSubmit}
              blurOnSubmit={true}
              onChangeText={confirmPassword => this.onChangeText("confirmPassword", confirmPassword)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              secureTextEntry={true}
              errorMessage={password !== confirmPassword ? "Mật khẩu không khớp" : ""}
            />

            <Button
              title="ĐĂNG KÝ"
              loading={loading}
              containerStyle={{ marginVertical: 8, marginTop: 30 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: APP_COLOR }}
              onPress={this.onSubmit}
            />

            <Button
              title="ĐĂNG NHẬP"
              disabled={loading}
              containerStyle={{ marginVertical: 8 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: '#aaaaaa' }}
              onPress={this.handleCloseModal}
            />
          </ScrollView>
        </Card>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClearErrorState: () => dispatch({ type: CLEAR_ERROR_STATE }),
    onCheckUserExistsRequest: user => dispatch(checkUserExists(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)