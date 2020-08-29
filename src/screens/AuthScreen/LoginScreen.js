import React, { Component } from 'react'
import {
  Text,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'
import { Header, Input, Card, Button, Image, CheckBox } from 'react-native-elements'
import Navigator from '../../utils/Navigator'
import { sideMenu } from '../../configs/menu/sideMenu'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: props?.auth?.credentials?.phoneNumber || '',
      password: props?.auth?.credentials?.password || '',
      remember: true,
      isNavigated: false
    };
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  onSubmit = async () => {
    const { phoneNumber, password, remember } = this.state
    if (phoneNumber && password) {
      this.props.onLoginRequest({ phoneNumber, password, remember })
    }
  };

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleOpenSignup = () => {
    Navigator.showModal("SignupScreen")
  }

  render() {
    const { phoneNumber, password, remember, isNavigated } = this.state
    const loginError = this.props.auth.message
    const { auth: { loading, authenticated }, app: { backgroundColor, textColor } } = this.props
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
          centerComponent={{ text: "ĐĂNG NHẬP", style: { color: textColor, fontSize: 18 } }}
          backgroundColor={backgroundColor}
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
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{
              flex: 1,
              paddingTop: 15,
              paddingHorizontal: 10,
              color: 'red'
            }}>
              {typeof (loginError) == typeof ("") ? loginError : ""}
            </Text>

            <Input
              label="Số điện thoại"
              placeholder="0987 654 321"
              keyboardType='phone-pad'
              returnKeyType="next"
              onSubmitEditing={() => this.refPassword.focus()}
              blurOnSubmit={false}
              value={phoneNumber}
              onChangeText={phoneNumber => this.onChangeText("phoneNumber", phoneNumber)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              leftIcon={{ type: 'feather', name: 'phone', color: "#aaaaaa", size: 20 }}
            />

            <Input
              label="Mật khẩu"
              placeholder="**************"
              leftIcon={{ type: 'feather', name: 'lock', color: "#aaaaaa", size: 20 }}
              value={password}
              autoCapitalize="none"
              returnKeyType="done"
              ref={r => (this.refPassword = r)}
              onSubmitEditing={this.onSubmit}
              blurOnSubmit={true}
              onChangeText={password => this.onChangeText("password", password)}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ paddingHorizontal: 10, paddingVertical: 5, color: '#555555' }}
              secureTextEntry={true}
            />

            <CheckBox
              containerStyle={{ flex: 1, marginTop: 10 }}
              textStyle={{ fontSize: 16, fontWeight: "normal" }}
              title="Nhớ mật khẩu"
              onPress={() => this.setState({ remember: !remember })}
              checked={remember}
            />

            <Button
              title="ĐĂNG NHẬP"
              loading={loading}
              containerStyle={{ marginVertical: 8, marginTop: 30 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: backgroundColor }}
              onPress={this.onSubmit}
            />

            <Text style={{
              textAlign: "center",
              fontSize: 15
            }}>Quên mật khẩu?</Text>

            <Button
              title="ĐĂNG KÝ"
              disabled={loading}
              containerStyle={{ marginVertical: 8 }}
              buttonStyle={{ paddingVertical: 15, backgroundColor: '#aaaaaa' }}
              onPress={this.handleOpenSignup}
            />
          </ScrollView>

        </Card>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    app: state.app,
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClearErrorState: () => dispatch({ type: CLEAR_ERROR_STATE }),
    onLoginRequest: user => dispatch(Actions.loginRequest(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)