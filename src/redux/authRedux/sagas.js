import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'
import { Roles } from '../../constants/roles';

function* loginAsync(action) {
  try {
    const loginResponse = yield callApi(`account/login`, 'POST', action.payload)
    const token = loginResponse.data
    const profileResponse = yield callApi(`account/me`, 'POST', null, token)
    const user = profileResponse.data
    yield put({ type: Types.LOGIN_SUCCEEDED, payload: { user, token } })
  } catch (error) {
    console.log("function*loginAsync -> error", error?.response?.data)
    yield put({ type: Types.LOGIN_FAILED, payload: error?.response?.data })
  }
}

function* signupAsync(action) {
  try {
    const deviceToken = store.getState().app.deviceToken
    if (!deviceToken) {
      console.log("Device token not found");
    }
    const newUser = Object.assign(action.payload, {
      deviceToken,
      role: Roles.user
    })
    const signupResponse = yield callApi(`account/register`, 'POST', newUser)
    const token = signupResponse.data
    const profileResponse = yield callApi(`account/me`, 'POST', null, token)
    const user = profileResponse.data
    yield put({ type: Types.SIGNUP_SUCCEEDED, payload: { user, token } })
  } catch (error) {
    console.log("function*signupAsync -> error", error?.response?.data)
    yield put({ type: Types.SIGNUP_FAILED, payload: error?.response?.data })
  }
}

export const watchAuthSaga = [
  takeLatest(Types.LOGIN_REQUEST, loginAsync),
  takeLatest(Types.SIGNUP_REQUEST, signupAsync)
]