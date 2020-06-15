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

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {
        phoneNumber: '0858222957',
        password: 'Tai16031999@',
      },
      error: {
        phoneNumber: '',
        password: '',
      },
      message: ''
    };
  }

  onSubmit = async () => {
    this.setState({ loading: true })
    const { phoneNumber, password } = this.state.user
    this.props.onLoginRequest({ phoneNumber, password })
    this.setState({ loading: false })
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
    const { loading, user, message } = this.state
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
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoginRequest: user => dispatch(Actions.loginRequest(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)