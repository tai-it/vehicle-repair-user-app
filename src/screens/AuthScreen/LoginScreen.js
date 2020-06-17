import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { styles } from '../../styles'
import Loading from '../../components/Loading'
import { APP_COLOR } from '../../utils/AppSettings'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        phoneNumber: '0858222957',
        password: 'Tai16031999@@',
      }
    };
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  onSubmit = async () => {
    const { user } = this.state
    this.props.onLoginRequest(user)
  };

  onChangeText = (key, value) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [key]: value,
      },
    }));
  };

  render() {
    const { user, message } = this.state
    const loginError = this.props.auth.message
    const { loading } = this.props.auth
    if (loading) {
      return <Loading message='Đang xử lý...' />
    }
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderColor: '#E9E9E9',
            backgroundColor: APP_COLOR
          }}>
          <Text style={styles.title}>Đăng nhập</Text>
        </View>
        <ScrollView style={styles.container}>
          <Text style={{ flex: 1, paddingTop: 10, color: 'red' }}>{typeof (loginError) == typeof ("") ? loginError : ""}</Text>
          <Text style={{ color: 'red', paddingTop: 5, paddingBottom: 10, fontSize: 17 }}>{message}</Text>
          <View>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('phoneNumber', value)}
              value={user.phoneNumber}
              placeholder="+84 xxx xxx xxx"
              autoCapitalize="none"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => this.refPassword.focus()}
              blurOnSubmit={false}
            />

            <Text style={styles.label}>Mật khẩu *</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('password', value)}
              value={user.password}
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="done"
              ref={r => (this.refPassword = r)}
              onSubmitEditing={this.onSubmit}
              blurOnSubmit={true}
            />
          </View>

          <View
            style={[
              styles.formControl,
              styles.contentCenter,
              styles.btnContainer,
            ]}>
            <TouchableOpacity
              onPress={() => this.props.onNavigateToSignup()}
              style={[styles.btn, styles.contentCenter]}>
              <Text style={{ fontSize: 15 }}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onSubmit}
              style={[styles.btn, { backgroundColor: APP_COLOR }, styles.contentCenter]}>
              <Text style={[{ fontSize: 15 }, styles.textWhite]}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pavicy}>
            <Text style={[styles.textCenter, styles.label]}>Quên mật khẩu?</Text>
          </View>
        </ScrollView>
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