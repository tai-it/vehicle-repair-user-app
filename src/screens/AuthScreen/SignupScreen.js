import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'
import { Header, Card, Input, Button } from 'react-native-elements'

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: ""
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

  onSignup = () => {
    const { name, phoneNumber, email, password, confirmPassword } = this.state
    if (name && phoneNumber && password === confirmPassword) {
      this.props.onSignupRequest({
        name,
        phoneNumber,
        email: email || null,
        password
      })
    }
  }

  render() {
    const { name, phoneNumber, email, password, confirmPassword } = this.state
    const { loading, errors } = this.props.auth
    return (
      <>
        <Header
          centerComponent={{ text: "ĐĂNG KÝ TÀI KHOẢN", style: { color: '#fff', fontSize: 18 } }}
          backgroundColor={APP_COLOR}
          containerStyle={{ paddingTop: 0, height: 60 }}
        />
        <Card containerStyle={{ flex: 1, marginBottom: 15 }}>
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
              leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
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
              leftIcon={{ type: 'feather', name: 'phone', color: "#aaaaaa" }}
              errorMessage={errors?.find(x => x.propertyName == "PhoneNumber")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Mật khẩu"
              placeholder="**************"
              leftIcon={{ type: 'feather', name: 'lock', color: "#aaaaaa" }}
              value={password}
              autoCapitalize="none"
              returnKeyType="next"
              ref={r => (this.refPassword = r)}
              onSubmitEditing={() => this.refConfirmPassword.focus()}
              blurOnSubmit={true}
              onChangeText={password => this.onChangeText("password", password)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              secureTextEntry={true}
              errorMessage={errors?.find(x => x.propertyName == "Password")?.errorMessage.split(";")[0] || ""}
            />

            <Input
              label="Xác nhận mật khẩu"
              placeholder="**************"
              leftIcon={{ type: 'feather', name: 'lock', color: "#aaaaaa" }}
              value={confirmPassword}
              autoCapitalize="none"
              returnKeyType="done"
              ref={r => (this.refConfirmPassword = r)}
              onSubmitEditing={this.onSignup}
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
              buttonStyle={{ paddingVertical: 15 }}
              onPress={this.onSignup}
            />

            <Button
              title="ĐĂNG NHẬP"
              containerStyle={{ marginVertical: 8 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: '#aaaaaa' }}
              onPress={this.props.onNavigateToLogin}
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
    onSignupRequest: user => dispatch(Actions.signupRequest(user)),
    onPhoneNumberConfirmed: () => dispatch(Actions.phoneConfirmed())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)