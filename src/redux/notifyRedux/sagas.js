import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'

function* fetchNotificationsAsync({ payload }) {
  try {
    const { auth: { token }, notify: { notifications } } = store.getState()
    const response = yield callApi(`notifications?isDesc=true&limit=10&offset=${payload}`, 'GET', null, token)
    const data = response?.data
    if (payload > 1) {
      data.sources.unshift(...notifications)
    }
    yield put({ type: Types.FETCH_NOTIFICATIONS_SUCCEEDED, payload: { data } })
  } catch (error) {
    console.log(error);
    let message = error.response
    yield put({ type: Types.FETCH_NOTIFICATIONS_FAILED, payload: { message } })
  }
}

export const watchNotifySaga = [
  takeLatest(Types.FETCH_NOTIFICATIONS_REQUEST, fetchNotificationsAsync)
]