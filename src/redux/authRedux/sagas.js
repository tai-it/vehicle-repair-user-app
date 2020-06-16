import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'
import { Roles } from '../../constants/roles';
import * as Actions from './actions'

function* loginAsync(action) {
  try {
    const response = yield callApi(`account/login`, 'POST', action.payload)
    const token = response.data
    yield put({ type: Types.LOGIN_SUCCEEDED, payload: { token } })
    yield put(Actions.fetchProfileRequest(token))
  } catch (error) {
    console.log("function*loginAsync -> error", error?.response)
    let message = error?.response?.data || "Có lỗi xảy ra, vui lòng thử lại"
    yield put({ type: Types.LOGIN_FAILED, payload: { message } })
  }
}

function* signupAsync(action) {
  try {
    const deviceToken = store.getState().app.deviceToken
    if (!deviceToken) {
      console.log("Không tìm thấy DeviceToken");
    }
    const newUser = Object.assign(action.payload, {
      deviceToken,
      role: Roles.user
    })
    const response = yield callApi(`account/register`, 'POST', newUser)
    const token = response.data
    yield put({ type: Types.SIGNUP_SUCCEEDED, payload: { token } })
    yield put(Actions.fetchProfileRequest(token))
  } catch (error) {
    let message = typeof (error?.response) == typeof ("") ? error?.response : "Có lỗi xảy ra, vui lòng thử lại"
    let errors = error?.response?.data || []
    yield put({ type: Types.SIGNUP_FAILED, payload: { message, errors } })
  }
}

function* fetchProfileAsync(action) {
  try {
    const response = yield callApi(`account/me`, 'GET', null, action.payload)
    const user = response.data
    yield put({ type: Types.FETCH_PROFILE_SUCCEEDED, payload: { user } })
  } catch (error) {
    console.log("function*fetchProfileAsync -> error", error?.response)
    yield put({ type: Types.FETCH_PROFILE_FAILED })
  }
}

function* updateDeviceTokenAsync() {
  try {
    const deviceToken = store.getState().app.deviceToken
    if (!deviceToken) {
      console.log("Không tìm thấy DeviceToken");
    }
    const token = store.getState().auth.token
    console.log("function*updateProfileAsync -> deviceToken, token: ", deviceToken, token)
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
  takeLatest(Types.UPDATE_DEVICE_TOKEN_REQUEST, updateDeviceTokenAsync),
]