import { put, takeLatest } from 'redux-saga/effects';
import * as Types from './types';
import callApi from '../../utils/apiCaller';
import { store } from '../store'

function* fetchNotificationsAsync() {
  try {
    const { token } = store.getState().auth
    const response = yield callApi('notifications?isDesc=true', 'GET', null, token)
    const notifications = response.data.sources
    yield put({ type: Types.FETCH_NOTIFICATIONS_SUCCEEDED, payload: { notifications } })
  } catch (error) {
    console.log(error);
    let message = error.response
    yield put({ type: Types.FETCH_NOTIFICATIONS_FAILED, payload: { message } })
  }
}

export const watchNotifySaga = [
  takeLatest(Types.FETCH_NOTIFICATIONS_REQUEST, fetchNotificationsAsync)
]