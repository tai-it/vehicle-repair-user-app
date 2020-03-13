import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Picker
} from 'react-native'
import { connect } from 'react-redux'
import * as Actions from '../redux/authRedux/actions'
import { styles } from '../styles'
import firebase from 'react-native-firebase'
import { APP_COLOR } from '../utils/AppSettings'
import { countries } from '../constants/country'
import UpdateProfile from '../components/Profile/UpdateProfile'
import { Navigation } from 'react-native-navigation'
import { sideMenu } from '../configs/menu/sideMenu'
import { ToastAndroid } from 'react-native'

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      callingCode: countries[0].callingCode,
      phoneNumber: '',
      confirmResult: null,
      showResendCode: false
    }
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() })
        this.props.onLoginSucceeded(user.toJSON())
        ToastAndroid.show('Xác nhận thành công', ToastAndroid.LONG)
      } else {
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          callingCode: countries[0].callingCode,
          phoneNumber: '',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { callingCode, phoneNumber } = this.state;
    if (phoneNumber.length >= 9) {
      this.setState({ message: 'Đang gửi mã...' });
      firebase.auth().signInWithPhoneNumber(callingCode + phoneNumber)
        .then(confirmResult => {
          this.setState({
            confirmResult,
            message: 'Mã đã được gửi. Vui lòng kiểm tra tin nhắn của bạn. Nếu bạn không nhận được mã vui lòng đợi 30 giây để lấy mã mới'
          })
          setTimeout(() => this.setState({ showResendCode: true }), 30000)
        })
        .catch(error => this.setState({ message: `Đăng nhập thất bại: ${error.message}` }));
    } else {
      this.setState({ message: 'Vui lòng nhập số điện thoại' });
    }
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Đã xác thực thành công' });
        })
        .catch(error => this.setState({ message: `Mã xác thực không đúng, vui lòng kiểm tra lại.` }));
    }
  };

  renderPhoneNumberInput() {
    const { callingCode, phoneNumber } = this.state
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
        {/* <Text style={{ fontSize: 20, textAlign: "center", marginVertical: 20 }}>Chào mừng bạn đến với ứng dụng "SỬA XE 4.0". Chúc bạn có một chuyến đi an toàn.</Text> */}
        <View style={{ width: '100%', borderWidth: 1, borderColor: APP_COLOR, borderRadius: 3, paddingLeft: 10 }}>
          <Picker
            selectedValue={callingCode}
            style={{
              width: '100%'
            }}
            onValueChange={(callingCode, itemIndex) => this.setState({ callingCode })}>
            {countries.map((country, index) => <Picker.Item key={index} label={`${country.region} (${country.callingCode})`} value={country.callingCode} />)}
          </Picker>
        </View>
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <TextInput
            editable={false}
            style={[styles.textInput, { minWidth: 70, marginRight: 5 }]}
            value={callingCode}
          />
          <TextInput
            autoFocus
            style={[styles.textInput, { flex: 1 }]}
            onChangeText={phoneNumber => this.setState({ phoneNumber })}
            value={phoneNumber}
            placeholder="__ __ __  __ __ __  __ __ __"
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={this.signIn}
            blurOnSubmit={true}
          />
        </View>
        <TouchableOpacity
          onPress={this.signIn}
          style={[styles.btn, { backgroundColor: APP_COLOR, width: '100%' }, styles.contentCenter]}>
          <Text style={[{ fontSize: 16 }, styles.textWhite]}>{`Lấy mã`.toUpperCase()}</Text>
        </TouchableOpacity>
        <Text style={{ width: '100%', textAlign: "center", fontSize: 16, marginVertical: 30 }}>
          Để thuận tiện cho việc liên lạc và cung cấp mã xác thực, vui lòng <Text style={{ color: APP_COLOR }}>sử dụng số điện thoại bạn đang dùng</Text> để dễ dàng theo dõi.
        </Text>
      </View>
    );
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
    if (user) {
      if (!user.displayName) {
        return <UpdateProfile />
      } else {
        Navigation.setRoot({
          root: {
            sideMenu
          }
        })
      }
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
          <Text style={styles.title}>SỬA XE 4.0</Text>
        </View>
        {!user && !confirmResult && this.renderPhoneNumberInput()}

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
    onLoginSucceeded: user => dispatch(Actions.loginSucceeded(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)