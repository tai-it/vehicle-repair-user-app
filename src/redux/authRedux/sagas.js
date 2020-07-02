import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'
import { Roles } from '../../constants/roles';
import { isPasswordValidated } from '../../utils/Validator'
import { fetchNotifications } from '../notifyRedux/actions'
import { fetchOrders } from '../orderRedux/actions';
import { updateDeviceTokenRequest } from './actions';

function* loginAsync(action) {
  try {
    const response = yield callApi(`account/login`, 'POST', action.payload)
    const token = response.data
    yield put({ type: Types.LOGIN_SUCCEEDED, payload: { token } })
  } catch (error) {
    let message = error?.response?.data || "Có lỗi xảy ra, vui lòng thử lại"
    yield put({ type: Types.LOGIN_FAILED, payload: { message } })
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

    if (!isPasswordValidated(newUser.password)) {
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
    let message = typeof (error?.response) == typeof ("") ? error?.response : ""
    let errors = typeof (error?.response?.data) == typeof ([]) ? error?.response?.data : []
    yield put({ type: Types.SIGNUP_FAILED, payload: { message, errors } })
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
    }
  } catch (error) {
    yield put({ type: Types.FETCH_PROFILE_FAILED })
  }
}

function* updateProfileAsync({ payload }) {
  try {
    const { auth: { token } } = store.getState()
    const response = yield callApi('account/me', 'PUT', payload, token)
    const user = response.data
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
  takeLatest(Types.SIGNUP_REQUEST, signupAsync),
  takeLatest(Types.FETCH_PROFILE_REQUEST, fetchProfileAsync),
  takeLatest(Types.UPDATE_PROFILE_REQUEST, updateProfileAsync),
  takeLatest(Types.CHANGE_PASSWORD_REQUEST, changePasswordAsync),
  takeLatest(Types.UPDATE_DEVICE_TOKEN_REQUEST, updateDeviceTokenAsync)
]