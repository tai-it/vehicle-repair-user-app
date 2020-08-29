import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'
import { Roles } from '../../constants/roles';
import { isValidPassword } from '../../utils/Validator'
import { fetchNotifications } from '../notifyRedux/actions'
import { fetchOrders } from '../orderRedux/actions';
import { updateDeviceTokenRequest } from './actions';
import SplashScreen from 'react-native-splash-screen'
import Navigator from '../../utils/Navigator';

function* loginAsync({ payload }) {
  try {
    const { phoneNumber, password } = payload
    const response = yield callApi(`account/login`, 'POST', { phoneNumber, password })
    const token = response.data
    yield put({ type: Types.LOGIN_SUCCEEDED, payload: { token } })
    yield put({ type: Types.SET_CRIDENTIALS, payload })
  } catch (error) {
    let message = error?.response?.data || "Có lỗi xảy ra, vui lòng thử lại"
    yield put({ type: Types.LOGIN_FAILED, payload: { message } })
  }
}

function* checkUserExistsAsync({ payload }) {
  try {
    const { name, phoneNumber, password } = payload
    const response = yield callApi(`account/${phoneNumber}`, "POST")
    let errors = []
    if (!isValidPassword(password)) {
      errors.push({
        propertyName: "Password",
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ hoa, chữ thường, số và kí tự đặc biệt"
      })
      yield put({ type: Types.SIGNUP_FAILED, payload: { message: "", errors } })
      return
    }
    if (!response.data) {
      Navigator.showModal("PhoneConfirmScreen", { name, phoneNumber, password })
    } else {
      errors.push({
        propertyName: "PhoneNumber",
        errorMessage: "Số điện thoại này đã được sử dụng bởi tài khoản khác"
      })
      yield put({ type: Types.CHECK_USER_EXISTS_SUCCEEDED, payload: { errors } })
    }
  } catch (error) {
    console.log("function*checkUserExistsAsync -> error", error)
  }
}

function* signupAsync({ payload }) {
  try {
    const deviceToken = store.getState().app.deviceToken
    if (!deviceToken) {
      console.log("Không tìm thấy DeviceToken");
    }
    const newUser = Object.assign(payload, {
      deviceToken,
      role: Roles.user
    })
    if (!isValidPassword(newUser.password)) {
      let errors = [{
        propertyName: "Password",
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ hoa, chữ thường, số và kí tự đặc biệt"
      }]
      yield put({ type: Types.SIGNUP_FAILED, payload: { message: "", errors } })
      return
    }
    const response = yield callApi(`account/register`, 'POST', newUser)
    const token = response.data
    yield put({ type: Types.SIGNUP_SUCCEEDED, payload: { token } })
  } catch (error) {
    let errors = typeof (error?.response?.data) == typeof ([]) ? error?.response?.data : []
    yield put({ type: Types.SIGNUP_FAILED, payload: { errors } })
  }
}

function* fetchProfileAsync() {
  try {
    const { auth: { token, authenticated }, app: { deviceToken } } = store.getState()
    if (authenticated) {
      const response = yield callApi(`account/me`, 'GET', null, token)
      const user = response.data
      yield put({ type: Types.FETCH_PROFILE_SUCCEEDED, payload: { user } })
      yield put(fetchNotifications())
      yield put(fetchOrders())
      if (user.deviceToken !== deviceToken) {
        yield put(updateDeviceTokenRequest())
      }
      SplashScreen.hide()
    }
  } catch (error) {
    console.log("function*fetchProfileAsync -> error", error)
    yield put({ type: Types.FETCH_PROFILE_FAILED })
  }
}

function* phoneConfirmedAsync() {
  try {
    const { auth: { token } } = store.getState()
    yield callApi(`account/phone/confirmed`, 'PUT', null, token)
    yield put({ type: Types.PHONE_CONFIRMED_SUCCEEDED })
  } catch (error) {
    console.log("function*phoneConfirmedAsync -> error", error)
  }
}

function* updateProfileAsync({ payload }) {
  try {
    const { auth: { token } } = store.getState()
    const response = yield callApi('account/me', 'PUT', payload, token)
    const user = response.data
    Navigator.showOverlay({ message: 'Cập nhật thông tin thành công' })
    yield put({ type: Types.UPDATE_PROFILE_SUCCEEDED, payload: { user } })
  } catch (error) {
    let message = typeof (error?.response) == typeof ("") ? error?.response : ""
    let errors = typeof (error?.response?.data) == typeof ([]) ? error?.response?.data : []
    yield put({ type: Types.UPDATE_PROFILE_FAILED, payload: { message, errors } })
  }
}

function* changePasswordAsync({ payload }) {
  try {
    const { auth: { token } } = store.getState()
    const response = yield callApi('account/password', 'PUT', payload, token)
    Navigator.showOverlay({ message: 'Đổi mật khẩu thành công' })
    yield put({ type: Types.CHANGE_PASSWORD_SUCCEEDED, payload: { token: response.data } })
  } catch (error) {
    let errors = typeof (error?.response?.data) == typeof ([]) ? error?.response?.data : []
    let message = ""
    if (typeof (error?.response) == typeof ("")) {
      message = error?.response
    } else {
      errors.push({
        propertyName: "CurrentPassword",
        errorMessage: "Mật khẩu không chính xác"
      })
    }
    yield put({ type: Types.CHANGE_PASSWORD_FAILED, payload: { message, errors } })
  }
}

function* updateDeviceTokenAsync() {
  try {
    const { deviceToken } = store.getState().app
    if (!deviceToken) {
      console.log("Không tìm thấy DeviceToken");
    }
    const token = store.getState().auth.token
    yield callApi(`account/me`, 'PUT', { deviceToken }, token)
    yield put({ type: Types.UPDATE_DEVICE_TOKEN_SUCCEEDED, payload: { deviceToken } })
  } catch (error) {
    console.log(error);
  }
}

export const watchAuthSaga = [
  takeLatest(Types.LOGIN_REQUEST, loginAsync),
  takeLatest(Types.CHECK_USER_EXISTS_REQUEST, checkUserExistsAsync),
  takeLatest(Types.SIGNUP_REQUEST, signupAsync),
  takeLatest(Types.PHONE_CONFIRMED, phoneConfirmedAsync),
  takeLatest(Types.FETCH_PROFILE_REQUEST, fetchProfileAsync),
  takeLatest(Types.UPDATE_PROFILE_REQUEST, updateProfileAsync),
  takeLatest(Types.CHANGE_PASSWORD_REQUEST, changePasswordAsync),
  takeLatest(Types.UPDATE_DEVICE_TOKEN_REQUEST, updateDeviceTokenAsync)
]