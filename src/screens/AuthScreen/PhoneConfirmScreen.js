import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import Navigator from '../../utils/Navigator'
import auth from '@react-native-firebase/auth'
import PhoneFormater from '../../utils/PhoneFormater'

class PhoneConfirmScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      codes: []
    }
  }

  componentDidMount() {
    const { user: { phoneNumber } } = this.props.auth
    auth().signInWithPhoneNumber(PhoneFormater.normalize('0987654321'))
      .then(confirmResult => this.setState({ confirmResult }))
      .catch(error => console.log("error", error))
  }

  handleKeyboardPressed = num => {
    this.setState(prevState => ({
      codes: [...prevState.codes, num]
    }), () => {
      const { codes } = this.state
      if (codes.length >= 6) {
        this.confirmCode()
      }
    })
  }

  confirmCode = () => {
    const { codes, confirmResult } = this.state
    const codeInput = codes.join("")
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          console.log("User: ", user)
        })
        .catch(error => console.log("error", error))
    }
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { codes } = this.state
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
          <Text style={[styles.textWhite, { marginTop: 60, paddingVertical: 30, fontSize: 23 }]}>Xác minh số điện thoại</Text>
          <Text style={[styles.textWhite, { fontSize: 16, textAlign: "center", paddingHorizontal: 50 }]}>Nhập mã OTP đã được gửi tới số điện thoại (+84) 915 981 110</Text>
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
                onPress={() => this.handleKeyboardPressed(1)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(2)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(3)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(4)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(5)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(6)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>6</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(7)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(8)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(9)}
              >
                <Text style={[styles.textWhite, styles.btnText]}>9</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnRowContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handleKeyboardPressed(0)}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneConfirmScreen)
