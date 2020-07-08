import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import Navigator from '../../utils/Navigator'
import auth from '@react-native-firebase/auth'
import PhoneFormater from '../../utils/PhoneFormater'
import { phoneConfirmed } from '../../redux/authRedux/actions'

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
        const { phoneNumber } = this.props.auth.user
        if (user.phoneNumber === PhoneFormater.normalize(phoneNumber)) {
          this.props.onPhoneNumberConfirmed()
          this.handleCloseModal()
          return
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
    const { user: { phoneNumber } } = this.props.auth
    this.setState({ message: "Đang gửi mã..." })
    if (phoneNumber) {
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
    } else {
      setTimeout(() => this.sendVerificationCode(), 1000)
    }
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
        .then((user) => {
          this.props.onPhoneNumberConfirmed()
          this.handleCloseModal()
        })
        .catch(error => {
          this.setState({
            message: "Mã OTP không đúng"
          }, this.startShake)
        })
    }
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
    const { user: { phoneNumber } } = this.props.auth
    return (
      <LinearGradient
        colors={['#2730B3', '#6B18A4']}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.btnBack}
          onPress={this.handleCloseModal}
        >
          <Icon type="antdesign" name="left" color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={[styles.textWhite, { marginTop: 60, paddingVertical: 30, fontSize: 23 }]}>
            Xác minh số điện thoại
          </Text>
          <Text style={[styles.textWhite, { fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>
            Nhập mã OTP đã được gửi tới số điện thoại {PhoneFormater.display(phoneNumber)}
          </Text>
          <Animated.View style={{ transform: [{ translateX: this.shakeAnimation }] }}>
            <Text style={[styles.textWhite, { fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>{message}</Text>
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
            /> : <Text style={[styles.textWhite, { fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>{`Gửi lại mã sau (${countdown}s)`}</Text>)
          }
          <View style={styles.codeContainer}>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[0] || ""}</Text>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[1] || ""}</Text>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[2] || ""}</Text>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[3] || ""}</Text>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[4] || ""}</Text>
            <Text style={[styles.textWhite, styles.codeInput]}>{codes[5] || ""}</Text>
          </View>
          <View style={styles.keyboardContainer}>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('1')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('2')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('3')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('4')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('5')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('6')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>6</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('7')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('8')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('9')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>9</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed('0')}
              >
                <Text style={[styles.textWhite, styles.btnText]}>0</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
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
    borderBottomColor: "white"
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
    onPhoneNumberConfirmed: () => dispatch(phoneConfirmed())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneConfirmScreen)
