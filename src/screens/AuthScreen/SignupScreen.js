import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Picker,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { styles } from '../../styles'
import firebase from 'react-native-firebase'
import { APP_COLOR } from '../../utils/AppSettings'
import { countries } from '../../constants/country'
import { Navigation } from 'react-native-navigation'
import { sideMenu } from '../../configs/menu/sideMenu'
import { ToastAndroid } from 'react-native'

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      newUser: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      },
      error: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      },
      message: '',
      codeInput: '',
      callingCode: countries[0].callingCode,
      phoneNumber: '',
      confirmResult: null,
      showResendCode: false,
      deviceToken: ''
    }
  }

  componentDidMount() {
    firebase.messaging().getToken()
      .then(deviceToken => {
        if (deviceToken) {
          this.setState({ deviceToken })
        }
      })
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user.toJSON(),
          message: ''
        }, () => this.addUser())
        ToastAndroid.show('Xác nhận thành công', ToastAndroid.LONG)
      } else {
        this.setState({
          user: null,
          newUser: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
          },
          error: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
          },
          message: '',
          codeInput: '',
          callingCode: countries[0].callingCode,
          phoneNumber: '',
          confirmResult: null,
          showResendCode: false,
          deviceToken: ''
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    // Validation fields first
    let { callingCode, newUser: { phoneNumber } } = this.state
    if (callingCode === '+84' && phoneNumber.charAt(0) === '0') {
      phoneNumber = phoneNumber.substr(1)
    }
    if (phoneNumber.length >= 9) {
      this.setState({ message: 'Đang gửi mã...' });
      firebase.auth().signInWithPhoneNumber(callingCode + phoneNumber)
        .then(confirmResult => {
          this.setState({
            confirmResult,
            message: 'Mã đã được gửi. Vui lòng kiểm tra tin nhắn của bạn. Nếu bạn không nhận được mã vui lòng đợi 1 phút để lấy mã mới'
          })
          setTimeout(() => this.setState({ showResendCode: true }), 60000)
        })
        .catch(error => this.setState({ message: `Đăng nhập thất bại: ${error.message}` }));
    } else {
      this.setState({ message: 'Vui lòng nhập số điện thoại' });
    }
  }

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({
            message: 'Xác nhận thành công'
          })
        })
        .catch(error => this.setState({ message: `Mã xác thực không đúng, vui lòng kiểm tra lại.` }));
    }
  }

  addUser = () => {
    const { user: { uid, phoneNumber }, newUser: { firstName, lastName, password }, deviceToken } = this.state
    let pendingUser = {
      uid,
      firstName,
      lastName,
      fullName: lastName + ' ' + firstName,
      phoneNumber,
      password,
      deviceToken
    }
    firebase.database().ref('users')
      .child(uid)
      .set(pendingUser)
      .then(() => this.props.onSignupSucceeded(pendingUser))
  }

  onChangeText = (key, value) => {
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser,
        [key]: value,
      },
    }));
  }

  checkIfPhoneExists = async () => {
    let result = false
    const { callingCode, newUser: { phoneNumber } } = this.state
    const userRef = firebase.database().ref('users')
    await userRef.orderByChild('phoneNumber')
      .equalTo(callingCode + phoneNumber).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          result = true
          this.setState(prevState => ({
            error: {
              ...prevState.error,
              phoneNumber: 'Số điện thoại đã tồn tại',
            },
          }));
        } else {
          this.setState(prevState => ({
            error: {
              ...prevState.error,
              phoneNumber: '',
            },
          }));
        }
      })
    return result
  }

  renderFormInput() {
    const { newUser, error, callingCode } = this.state
    return (
      <ScrollView style={styles.container}>
        <Text style={[styles.label, { paddingVertical: 5 }]}>Quốc gia</Text>
        <View style={{ width: '100%', borderWidth: 1, borderColor: APP_COLOR, borderRadius: 3, paddingLeft: 10 }}>
          <Picker
            selectedValue={callingCode}
            style={{
              width: '100%', height: 45
            }}
            onValueChange={(callingCode, itemIndex) => this.setState({ callingCode })}>
            {countries.map((country, index) => <Picker.Item key={index} label={`${country.region} (${country.callingCode})`} value={country.callingCode} />)}
          </Picker>
        </View>

        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.label, { paddingTop: 10 }]}>SĐT *</Text>
            <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, paddingTop: 10, color: 'red' }}>{error.phoneNumber}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              editable={false}
              style={[styles.textInput, { minWidth: 50, marginRight: 5, color: '#111' }]}
              value={callingCode}
            />
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              onChangeText={phoneNumber => this.onChangeText('phoneNumber', phoneNumber)}
              onBlur={this.checkIfPhoneExists}
              value={newUser.phoneNumber}
              placeholder="987 654 321"
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => this.refFirstName.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.label}>Tên *</Text>
            <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.firstName}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={value => this.onChangeText('firstName', value)}
            value={newUser.firstName}
            placeholder="Tên"
            autoCapitalize="words"
            returnKeyType="next"
            ref={r => this.refFirstName = r}
            onSubmitEditing={() => this.refLastName.focus()}
            blurOnSubmit={false}
          />

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.label}>Họ *</Text>
            <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.lastName}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={value => this.onChangeText('lastName', value)}
            value={newUser.lastName}
            placeholder="Họ và đệm"
            autoCapitalize="words"
            returnKeyType="next"
            ref={r => this.refLastName = r}
            onSubmitEditing={() => this.refPassword.focus()}
            blurOnSubmit={false}
          />

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.label}>Mật khẩu *</Text>
            <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.password}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={value => this.onChangeText('password', value)}
            value={newUser.password}
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
            <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.confirmPassword}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={value =>
              this.onChangeText('confirmPassword', value)
            }
            onBlur={this.validate}
            value={newUser.confirmPassword}
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
            onPress={this.signIn}
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
    )
  }

  renderMessage() {
    const { message } = this.state
    if (!message.length) return null
    return (
      <Text style={{ padding: 20, fontSize: 16, textAlign: "center" }}>{message}</Text>
    )
  }

  renderVerificationCodeInput() {
    const { showResendCode, codeInput } = this.state
    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text style={{ fontSize: 16, paddingVertical: 10 }}>Vui lòng nhập mã xác nhận: </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={code => this.setState({ codeInput: code })}
          maxLength={6}
          placeholder={'__ __ __  __ __ __'}
          value={codeInput}
          keyboardType="phone-pad"
          returnKeyType="done"
          onSubmitEditing={this.confirmCode}
          blurOnSubmit={true}
        />
        <TouchableOpacity
          disabled={!showResendCode}
          onPress={() => {
            this.signIn
            this.setState({ showResendCode: false })
          }}
          style={[styles.btn, { backgroundColor: showResendCode ? APP_COLOR : '#c8c8c8', marginBottom: 10 }, styles.contentCenter]}>
          <Text style={[{ fontSize: 16 }, styles.textWhite]}>{`Gửi lại mã`.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.confirmCode}
          style={[styles.btn, { backgroundColor: APP_COLOR }, styles.contentCenter]}>
          <Text style={[{ fontSize: 16 }, styles.textWhite]}>{`Xác nhận`.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state
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

        {!user && !confirmResult && this.renderFormInput()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {this.renderMessage()}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignupSucceeded: user => dispatch(Actions.signupSucceeded(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)