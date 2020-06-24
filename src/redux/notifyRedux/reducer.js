import * as Types from './types'

const initState = {
  loading: false,
  pageIndex: 1,
  hasNextPage: false,
  notifications: [],
  message: ""
}

export default notifyReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case Types.FETCH_NOTIFICATIONS_SUCCEEDED:
      return {
        ...state,
        loading: false,
        pageIndex: action.payload.data.pageIndex,
        hasNextPage: action.payload.data.hasNextPage,
        notifications: action.payload.data.sources
      };
    case Types.FETCH_NOTIFICATIONS_FAILED:
      return {
        ...state,
        loading: false,
        message: action.payload.message
      };
    default:
      return state;
  }
};