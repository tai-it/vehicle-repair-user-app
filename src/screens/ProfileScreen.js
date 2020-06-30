import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { Icon, Input, Card, ListItem, Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import Navigator from '../utils/Navigator'
import LinearGradient from 'react-native-linear-gradient'
import PhoneFormater from '../utils/PhoneFormater'
import { format } from 'date-fns'
import { updateProfileRequest } from '../redux/authRedux/actions'
import { CLEAR_ERROR_STATE } from '../redux/authRedux/types'

class ProfileScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editable: false,
      name: props.auth.user.name || "",
      email: props.auth.user.email || "",
      address: props.auth.user.address || ""
    }
  }

  componentDidMount() {
    this.props.onClearErrorState()
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  handleSaveChanges = () => {
    this.props.onClearErrorState()
    const { name, email, address } = this.state
    const { auth: { user } } = this.props
    if (name === user.name && email === user.email && address === user.address) {
      this.setState({ editable: false })
      return
    }
    this.props.onUpdateProfile(email.length > 0 ? { name, email, address } : { name, address })
    setTimeout(() => {
      const { errors } = this.props.auth
      if (errors.length == 0) {
        this.setState({ editable: false })
      }
    }, 1000)
  }

  handleCloseModal = () => {
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { name, email, address, editable } = this.state
    const { user: { phoneNumber, createdOn, isActive, phoneNumberConfirmed }, errors } = this.props.auth
    return (
      <View style={styles.container}>
        {/* COVER */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#191654', '#43C6AC']}
          style={styles.cover}
        >
          <View style={styles.topContainer}>
            <Text style={styles.name}>{name || ""}</Text>
            <View style={styles.rowContainer}>
              <Badge status={isActive ? "success" : "error"} />
              <Text style={styles.status}>{isActive ? "Đang hoạt động" : "Đang tạm khoá"}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Icon
                type="feather"
                name="phone"
                color="white"
                size={16}
              />
              <Text style={styles.phoneNumber}>{PhoneFormater.normalize(phoneNumber) || ""}</Text>
              <Icon
                type="octicon"
                name={phoneNumberConfirmed ? "verified" : "unverified"}
                color="white"
                size={16}
              />
            </View>
          </View>
        </LinearGradient>

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.btnBack}
          onPress={this.handleCloseModal}
        >
          <Icon
            type="antdesign"
            name="left"
            color="white"
          />
        </TouchableOpacity>

        {/* EDIT/SAVE BUTTON */}
        {editable || errors.length > 0 ?
          <TouchableOpacity
            style={styles.btnSave}
            onPress={this.handleSaveChanges}
            activeOpacity={1}
          >
            <Icon
              type="feather"
              name="save"
              color="white"
            />
          </TouchableOpacity> :
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => this.setState({ editable: true })}
            activeOpacity={1}
          >
            <Icon
              type="simple-line-icon"
              name="pencil"
              color="white"
            />
          </TouchableOpacity>
        }

        {/* INFO */}
        {editable || errors.length > 0 ?
          <Card containerStyle={[styles.bodyContent, { paddingHorizontal: 20 }]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <Input
                label="Họ và tên"
                placeholder="Nguyễn Ngọc Hoàng"
                returnKeyType="next"
                onSubmitEditing={() => this.refEmail.focus()}
                blurOnSubmit={false}
                value={name}
                autoCapitalize="words"
                onChangeText={name => this.onChangeText("name", name)}
                containerStyle={{ marginTop: 20 }}
                inputStyle={styles.input}
                leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
                errorMessage={errors?.find(x => x.propertyName == "Name")?.errorMessage.split(";")[0] || ""}
              />

              <Input
                label="Địa chỉ"
                placeholder="6x Tên đường, Tên quận, Tên thành phố"
                leftIcon={{ type: 'feather', name: 'map-pin', color: "#aaaaaa" }}
                value={address}
                autoCapitalize="none"
                returnKeyType="done"
                ref={r => (this.refAddress = r)}
                onSubmitEditing={this.handleSaveChanges}
                blurOnSubmit={true}
                onChangeText={address => this.onChangeText("address", address)}
                containerStyle={{ marginTop: 20 }}
                inputStyle={styles.input}
                errorMessage={errors?.find(x => x.propertyName == "Address")?.errorMessage.split(";")[0] || ""}
              />

              <Input
                label="Email"
                placeholder="user@example.com"
                keyboardType='email-address'
                returnKeyType="next"
                autoCapitalize={false}
                ref={r => (this.refEmail = r)}
                onSubmitEditing={() => this.refAddress.focus()}
                blurOnSubmit={false}
                value={email}
                onChangeText={email => this.onChangeText("email", email)}
                containerStyle={{ marginTop: 20 }}
                inputStyle={styles.input}
                leftIcon={{ type: 'feather', name: 'mail', color: "#aaaaaa" }}
                errorMessage={errors?.find(x => x.propertyName == "Email")?.errorMessage.split(";")[0] || ""}
              />
            </ScrollView>
          </Card> :
          <Card containerStyle={styles.bodyContent}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <ListItem
                leftIcon={{ type: 'feather', name: 'user', color: "#aaaaaa" }}
                title="Họ và tên"
                titleStyle={styles.title}
                subtitle={name}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'map-pin', color: "#aaaaaa" }}
                title="Địa chỉ"
                titleStyle={styles.title}
                subtitle={address || "Chưa cập nhật"}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'mail', color: "#aaaaaa" }}
                title="Email"
                titleStyle={styles.title}
                subtitle={email || "Chưa cập nhật"}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
              <ListItem
                leftIcon={{ type: 'feather', name: 'user-check', color: "#aaaaaa" }}
                title="Đăng ký ngày"
                titleStyle={styles.title}
                subtitle={format(new Date(createdOn), "dd-MM-yyyy H:mma")}
                subtitleStyle={styles.subtitle}
                bottomDivider
              />
            </ScrollView>
          </Card>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cover: {
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 185
  },
  topContainer: {
    position: "absolute",
    bottom: 20,
    left: 25
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontSize: 25,
    color: "white"
  },
  status: {
    color: "white",
    padding: 5
  },
  phoneNumber: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 5
  },
  btnEdit: {
    zIndex: 1000,
    position: "absolute",
    height: 60,
    width: 60,
    top: 150,
    right: 10,
    backgroundColor: "rgb(254, 54, 97)",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 60
  },
  btnSave: {
    zIndex: 1000,
    position: "absolute",
    height: 60,
    width: 60,
    top: 150,
    right: 10,
    backgroundColor: "#00C851",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 60
  },
  btnBack: {
    zIndex: 1001,
    position: "absolute",
    height: 40,
    width: 40,
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 40
  },
  bodyContent: {
    flex: 1,
    marginBottom: 15
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#555555',
    fontSize: 16
  },
  title: {
    fontSize: 16
  },
  subtitle: {
    fontSize: 16
  }
})

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClearErrorState: () => dispatch({ type: CLEAR_ERROR_STATE }),
    onUpdateProfile: user => dispatch(updateProfileRequest(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)