import { put, takeLatest } from 'redux-saga/effects'
import * as Types from './types'
import { store } from '../store'
import callApi from '../../utils/apiCaller'
import { Navigation } from 'react-native-navigation'
import { animatedMedium } from '../../configs/navigation'
import { fetchOrders } from './actions'
import { fetchNotifications } from '../notifyRedux/actions'

function* fetchOrdersAsync({ payload }) {
  try {
    const { auth: { token }, ordering: { orders } } = store.getState()
    const response = yield callApi(`orders/me?isDesc=true&offset=${payload}&limit=10`, 'GET', null, token)
    const data = response?.data
    if (payload > 1) {
      data.sources.unshift(...orders)
    }
    yield put({ type: Types.FETCH_ORDERS_SUCCEEDED, payload: { data } })
  } catch (error) {
    console.log(error?.response);
  }
}

function* addOrderAsync({ payload }) {
  try {
    const { auth: { token } } = store.getState()
    const response = yield callApi(`orders`, 'POST', payload, token)
    const order = response?.data
    Navigation.dismissAllModals()
    Navigation.showModal({
      id: 'orderDetailModal',
      component: {
        name: 'OrderDetailModal',
        passProps: {
          order
        },
        options: animatedMedium
      }
    })
    yield put({ type: Types.ADD_ORDER_SUCCEEDED })
    yield put(fetchOrders())
    yield put(fetchNotifications())
  } catch (error) {
    alert(error?.response?.data)
    console.log(error?.response?.data)
    yield put({ type: Types.ADD_ORDER_FAILED })
  }
}

function* cancelOrderAsync({ payload }) {
  try {
    const { auth: { token } } = store.getState()
    const response = yield callApi(`orders/${payload}`, 'PUT', { status: "Đã huỷ" }, token)
    const order = response?.data
    Navigation.dismissAllModals()
    Navigation.showModal({
      id: 'orderDetailModal',
      component: {
        name: 'OrderDetailModal',
        passProps: {
          order
        },
        options: animatedMedium
      }
    })
    yield put({ type: Types.CANCEL_ORDER_SUCCEEDED })
    yield put(fetchOrders())
    yield put(fetchNotifications())
  } catch (error) {
    alert(error?.response?.data)
    console.log(error?.response?.data)
    yield put({ type: Types.CANCEL_ORDER_FAILED })
  }
}

export const watchOrderSaga = [
  takeLatest(Types.FETCH_ORDERS_REQUEST, fetchOrdersAsync),
  takeLatest(Types.ADD_ORDER_REQUEST, addOrderAsync),
  takeLatest(Types.CANCEL_ORDER_REQUEST, cancelOrderAsync),
]