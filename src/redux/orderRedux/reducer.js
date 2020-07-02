import * as Types from './types'

const initState = {
  loading: false,
  booking: false,
  canceling: false,
  pageIndex: 1,
  hasNextPage: false,
  orders: []
}

export default orderReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case Types.FETCH_ORDERS_SUCCEEDED:
      return {
        ...state,
        loading: false,
        pageIndex: action.payload.data.pageIndex,
        hasNextPage: action.payload.data.hasNextPage,
        orders: action.payload.data.sources
      }
    case Types.FETCH_ORDERS_FAILED:
      return {
        ...state,
        loading: false
      }
    case Types.ADD_ORDER_REQUEST:
      return {
        ...state,
        booking: true
      }
    case Types.ADD_ORDER_SUCCEEDED:
      return {
        ...state,
        booking: false
      }
    case Types.ADD_ORDER_FAILED:
      return {
        ...state,
        booking: false
      }
    case Types.CANCEL_ORDER_REQUEST:
      return {
        ...state,
        canceling: true
      }
    case Types.CANCEL_ORDER_SUCCEEDED:
      return {
        ...state,
        canceling: false
      }
    case Types.CANCEL_ORDER_FAILED:
      return {
        ...state,
        canceling: false
      }
    default:
      return state
  }
}