import * as Types from './types'

const initState = {
  loading: false,
  notifications: [],
  message: ""
}

export default notifyReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...initState,
        loading: true
      };
    case Types.FETCH_NOTIFICATIONS_SUCCEEDED:
      return {
        ...initState,
        loading: false,
        notifications: action.payload.notifications,
      };
    case Types.FETCH_NOTIFICATIONS_FAILED:
      return {
        ...initState,
        loading: false,
        message: action.payload.message
      };
    default:
      return state;
  }
};