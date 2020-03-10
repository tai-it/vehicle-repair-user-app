import React, { Component } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { styles } from '../../styles';
import { connect } from 'react-redux';
import * as Actions from '../../redux/authRedux/actions';
import Loading from '../../components/Loading';
import firebase from 'react-native-firebase'
import { APP_COLOR } from '../../utils/AppSettings';

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      error: {
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
      }
    };
  }

  checkIfPhoneExists = async () => {
    let result = false
    const { phone } = this.state.user
    const userRef = firebase.database().ref('users')
    await userRef.orderByChild('phone')
      .equalTo(phone).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          result = true
          this.setState(prevState => ({
            error: {
              ...prevState.error,
              phone: 'Số điện thoại đã tồn tại',
            },
          }));
        } else {
          this.setState(prevState => ({
            error: {
              ...prevState.error,
              phone: '',
            },
          }));
        }
      })
    return result
  }

  onSubmit = async () => {
    this.setState({ loading: true })
    const { firstName, lastName, phone, password } = this.state.user
    if (!await this.checkIfPhoneExists()) {
      const userRef = firebase.database().ref('users')
      const key = userRef.push().key
      const user = {
        id: key,
        firstName,
        lastName,
        fullName: lastName + ' ' + firstName,
        phone,
        password
      }
      await userRef.child(key).update(user).then(() => {
        this.props.onSignupSucceeded(user)
      })
    }
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
    const { loading, user, error } = this.state;
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
          <Text style={styles.title}>Đăng ký tài khoản</Text>
        </View>
        <ScrollView style={styles.container}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Tên *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.firstName}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('firstName', value)}
              value={user.firstName}
              placeholder="Nhập tên"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => this.refLastName.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text>Họ *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.lastName}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('lastName', value)}
              value={user.lastName}
              placeholder="Nhập họ và họ đệm"
              autoCapitalize="words"
              returnKeyType="next"
              ref={r => (this.refLastName = r)}
              onSubmitEditing={() => this.refPhone.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text>Số điện thoại *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.phone}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value =>
                this.onChangeText('phone', value)
              }
              onBlur={this.checkIfPhoneExists}
              value={user.phone}
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
              maxLength={11}
              returnKeyType="next"
              ref={r => (this.refPhone = r)}
              onSubmitEditing={() => this.refPassword.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text>Mật khẩu *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.password}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value => this.onChangeText('password', value)}
              value={user.password}
              placeholder="Nhập mật khẩu"
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="next"
              ref={r => (this.refPassword = r)}
              onSubmitEditing={() => this.refConfirmPassword.focus()}
              blurOnSubmit={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text>Xác nhận mật khẩu *</Text>
              <Text numberOfLines={1} style={{ textAlign: "right", flex: 1, color: 'red' }}>{error.confirmPassword}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={value =>
                this.onChangeText('confirmPassword', value)
              }
              onBlur={this.validate}
              value={user.confirmPassword}
              placeholder="Nhắc lại mật khẩu"
              autoCapitalize="none"
              secureTextEntry={true}
              returnKeyType="done"
              ref={r => (this.refConfirmPassword = r)}
              onSubmitEditing={this.onSubmit}
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
              onPress={this.onSubmit}
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

const mapDispatchToProps = dispatch => {
  return {
    onSignupSucceeded: user => dispatch(Actions.signupSucceeded(user)),
  };
};

export default connect(null, mapDispatchToProps)(SignupScreen);