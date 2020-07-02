import * as Types from './types'

export const fetchOrders = (pageIndex = 1) => {
  return {
    type: Types.FETCH_ORDERS_REQUEST,
    payload: pageIndex
  }
}

export const addOrder = order => {
  return {
    type: Types.ADD_ORDER_REQUEST,
    payload: order
  }
}

export const cancelOrder = id => {
  return {
    type: Types.CANCEL_ORDER_REQUEST,
    payload: id
  }
}