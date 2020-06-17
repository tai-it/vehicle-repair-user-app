import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Picker,
  ScrollView
} from 'react-native'
import Loading from '../../components/Loading'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { styles } from '../../styles'
import { APP_COLOR } from '../../utils/AppSettings'
import { countries } from '../../constants/country'
import { CLEAR_ERROR_STATE } from '../../redux/authRedux/types'

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: {
        name: "Trần Văn Tài",
        phoneNumber: "0858222957",
        email: "",
        password: "Tai16031999@@",
        confirmPassword: "Tai16031999@@"
      }
    }
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  onChangeText = (key, value) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [key]: value,
      },
    }));
  }

  onSignup = () => {
    const { name, phoneNumber, email, password } = this.state.user
    this.props.onSignupRequest({
      name,
      phoneNumber,
      email: email || null,
      password
    })
  }

  render() {
    const { user } = this.state
    const { loading, errors, message } = this.props.auth
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
          <Text style={styles.title}>Đăng ký tài khoản</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={{ flex: 1, paddingTop: 10, color: 'red' }}>{message || ""}</Text>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.label, { paddingTop: 10 }]}>SĐT *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, paddingTop: 10, color: 'red' }}>
                {errors?.find(x => x.propertyName == "PhoneNumber")?.errorMessage.split(";")[0] || ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                onChangeText={phoneNumber => this.onChangeText('phoneNumber', phoneNumber)}
                onBlur={this.checkIfPhoneExists}
                value={user.phoneNumber}
                placeholder="0987 654 321"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => this.refName.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>Họ và Tên*</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>
                {errors?.find(x => x.propertyName == "Name")?.errorMessage.split(";")[0] || ""}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('name', value)}
              value={user.name}
              placeholder="Họ và Tên"
              autoCapitalize="words"
              returnKeyType="next"
              ref={r => this.refName = r}
              onSubmitEditing={() => this.refPassword.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>Mật khẩu *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>
                {errors?.find(x => x.propertyName == "Password")?.errorMessage.split(";")[0] || ""}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('password', value)}
              value={user.password}
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="next"
              ref={r => this.refPassword = r}
              onSubmitEditing={() => this.refConfirmPassword.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>Xác nhận mật khẩu *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>

              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value =>
                this.onChangeText('confirmPassword', value)
              }
              onBlur={this.validate}
              value={user.confirmPassword}
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="done"
              ref={r => this.refConfirmPassword = r}
              onSubmitEditing={this.signIn}
            />
          </View>

          <View
            style={[
              styles.formControl,
              styles.contentCenter,
              styles.btnContainer,
            ]}>
            <TouchableOpacity
              onPress={() => this.props.onNavigateToLogin()}
              style={[styles.btn, styles.contentCenter]}>
              <Text style={{ fontSize: 15 }}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onSignup}
              style={[styles.btn, { backgroundColor: APP_COLOR }, styles.contentCenter]}>
              <Text style={[{ fontSize: 15 }, styles.textWhite]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pavicy}>
            <Text style={styles.textCenter}>
              Bằng việc xác nhận tạo tài khoản, bạn đã đồng ý với các{' '}
              <Text style={{ color: APP_COLOR }}>điều khoản quy định</Text> của
              chúng tôi
                </Text>
          </View>
        </ScrollView>
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