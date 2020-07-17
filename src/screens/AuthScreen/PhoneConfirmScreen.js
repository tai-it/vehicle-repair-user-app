import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Button, Header } from 'react-native-elements'
import Navigator from '../../utils/Navigator'
import auth from '@react-native-firebase/auth'
import PhoneFormater from '../../utils/PhoneFormater'
import { signupRequest } from '../../redux/authRedux/actions'
import { APP_COLOR } from '../../utils/AppSettings'

class PhoneConfirmScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: "",
      countdown: 0,
      codes: []
    }
    this.shakeAnimation = new Animated.Value(0)
  }

  UNSAFE_componentWillMount() {
    if (auth().currentUser) {
      auth().signOut()
    }
  }

  componentDidMount() {
    this.sendVerificationCode()
    this._subscribeAuth()
  }

  _subscribeAuth = () => {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        const { phoneNumber } = this.props
        if (user.phoneNumber === PhoneFormater.normalize(phoneNumber)) {
          this.onSignUp()
        }
      }
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  handleKeyboardPressed = num => {
    this.setState(prevState => ({
      codes: prevState.codes.length === 6 ? [num] : [...prevState.codes, num],
      message: ""
    }), () => {
      const { codes } = this.state
      if (codes.length >= 6) {
        this.confirmCode()
      }
    })
  }

  sendVerificationCode = () => {
    const { phoneNumber } = this.props
    this.setState({ message: "Đang gửi mã..." })
    auth().signInWithPhoneNumber(PhoneFormater.normalize(phoneNumber), true)
      .then(confirmResult => {
        this.setState({
          confirmResult,
          message: "Đã gửi",
          countdown: 60
        })
        this.counter = setInterval(this.timer, 1000)
      })
      .catch(error => console.log("error", error))
  }

  timer = () => {
    this.setState(prevState => ({
      countdown: prevState.countdown - 1
    }), () => {
      const { countdown } = this.state
      if (countdown <= 0) {
        clearInterval(this.counter)
        return
      }
    })
  }

  confirmCode = () => {
    const { codes, confirmResult } = this.state
    const codeInput = codes.join("")
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => { })
        .catch(error => {
          this.setState({
            message: "Mã OTP không đúng"
          }, this.startShake)
        })
    }
  }

  onSignUp = () => {
    const { name, phoneNumber, password } = this.props
    this.props.onSignupRequest({
      name,
      phoneNumber,
      password,
      phoneNumberConfirmed: true
    })
  }

  startShake = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, { toValue: 20, duration: 100 }),
      Animated.timing(this.shakeAnimation, { toValue: -20, duration: 100 }),
      Animated.timing(this.shakeAnimation, { toValue: 0, duration: 100 })
    ]).start();
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { codes, message, countdown, confirmResult } = this.state
    const { phoneNumber } = this.props
    return (
      <>
        <Header
          centerComponent={{ text: "XÁC MINH SĐT", style: { color: '#fff', fontSize: 18 } }}
          backgroundColor={APP_COLOR}
          containerStyle={{
            paddingTop: 0,
            paddingHorizontal: 18,
            height: 60
          }}
        />
        <View style={styles.contentContainer}>
          <Text></Text>
          <Text style={[{ fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>
            Nhập mã OTP đã được gửi tới số điện thoại {PhoneFormater.display(phoneNumber)}
          </Text>
          <Animated.View style={{ transform: [{ translateX: this.shakeAnimation }] }}>
            <Text style={[{ fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>{message}</Text>
          </Animated.View>
          {confirmResult && (countdown === 0 ?
            <Button
              title="Gửi lại mã"
              titleStyle={{ paddingHorizontal: 10 }}
              icon={
                <Icon
                  type="font-awesome"
                  name="send-o"
                  color="white"
                />
              }
              onPress={this.sendVerificationCode}
            /> : <Text style={[{ fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>{`Gửi lại mã sau (${countdown}s)`}</Text>)
          }
          <View style={styles.codeContainer}>
            <Text style={[styles.codeInput]}>{codes[0] || ""}</Text>
            <Text style={[styles.codeInput]}>{codes[1] || ""}</Text>
            <Text style={[styles.codeInput]}>{codes[2] || ""}</Text>
            <Text style={[styles.codeInput]}>{codes[3] || ""}</Text>
            <Text style={[styles.codeInput]}>{codes[4] || ""}</Text>
            <Text style={[styles.codeInput]}>{codes[5] || ""}</Text>
          </View>
          <View style={styles.keyboardContainer}>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('1')}
              >
                <Text style={[styles.btnText]}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('2')}
              >
                <Text style={[styles.btnText]}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('3')}
              >
                <Text style={[styles.btnText]}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('4')}
              >
                <Text style={[styles.btnText]}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('5')}
              >
                <Text style={[styles.btnText]}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('6')}
              >
                <Text style={[styles.btnText]}>6</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('7')}
              >
                <Text style={[styles.btnText]}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('8')}
              >
                <Text style={[styles.btnText]}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('9')}
              >
                <Text style={[styles.btnText]}>9</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('0')}
              >
                <Text style={[styles.btnText]}>0</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )
  }
}

const { height } = Dimensions.get("screen")

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  btnBack: {
    zIndex: 1001,
    position: "absolute",
    height: 40,
    width: 40,
    top: 10,
    left: 10,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 40
  },
  textWhite: {
    color: 'white'
  },
  codeContainer: {
    flexDirection: "row",
    width: '100%',
    maxWidth: 300,
    justifyContent: "space-around",
    alignItems: "center"
  },
  codeInput: {
    fontSize: 27,
    fontWeight: 'bold',
    minWidth: 35,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: APP_COLOR
  },
  keyboardContainer: {
    height: height * .4,
    width: '100%',
    marginBottom: 20
  },
  btnRowContainer: {
    flexDirection: "row",
    flex: 1,
  },
  btn: {
    flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 25,
    fontWeight: "bold"
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignupRequest: user => dispatch(signupRequest(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneConfirmScreen)
