import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native'
import { styles } from '../../styles'
import firebase from 'react-native-firebase'
import { APP_COLOR } from '../../utils/AppSettings'
import { connect } from 'react-redux'
import * as Actions from '../../redux/authRedux/actions'
import { Navigation } from 'react-native-navigation'
import { sideMenu } from '../../configs/menu/sideMenu'

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: props.auth.user?.displayName || ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.auth.user !== this.props.auth.user) {
      this.setState({ user: this.props.auth.user })
    }
  }

  updateProfile = async () => {
    const { displayName } = this.state
    if (displayName) {
      await firebase.auth().currentUser.updateProfile({ displayName })
      this.props.onUpdateProfile(firebase.auth().currentUser)
      Navigation.setRoot({
        root: {
          sideMenu
        }
      })
    }
  }

  render() {
    const { displayName } = this.state
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
          <Text style={styles.title}>Cập nhật thông tin</Text>
        </View>
        <ScrollView style={styles.container}>
          <View>
            <Text style={{ fontSize: 16 }} >Tên Đầy Đủ *</Text>
            <TextInput
              style={[styles.textInput, { fontSize: 16, textAlign: "left", paddingHorizontal: 20 }]}
              onChangeText={displayName => this.setState({ displayName })}
              value={displayName}
              placeholder="Join Smith"
              autoCapitalize="words"
              returnKeyType="done"
            />

            <Text style={{ fontSize: 16 }} >Số Điện Thoại</Text>
            <TextInput
              editable={false}
              style={[styles.textInput, { fontSize: 16, textAlign: "left", color: '#c8c8c8', paddingHorizontal: 20 }]}
              value={firebase.auth().currentUser.phoneNumber}
            />
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={this.updateProfile}
            style={[styles.btn, { backgroundColor: APP_COLOR }, styles.contentCenter]}>
            <Text style={[{ fontSize: 15 }, styles.textWhite]}>{`Cập nhật`.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
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
    onUpdateProfile: user => dispatch(Actions.updateProfileSucceeded(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile)