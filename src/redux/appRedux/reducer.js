import * as Types from './types'

const initState = {
  color: '#1e1e23',
  deviceToken: "",
  isStarted: false
}

export default appReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.CHANGE_APP_COLOR:
      return {
        ...state,
        color: action.payload
      };
    case Types.CHANGE_DEVICE_TOKEN:
      return {
        ...state,
        deviceToken: action.payload
      };
    case Types.GET_STARTED:
      return {
        ...state,
        isStarted: true
      };
    default:
      return state;
  }
}