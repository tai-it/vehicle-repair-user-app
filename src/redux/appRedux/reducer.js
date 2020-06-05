import * as Types from './types'

const initState = {
  color: '#ff6666',
  deviceToken: ""
}

export default appReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.CHANGE_APP_COLOR:
      return {
        ...initState,
        color: action.payload
      };
    case Types.CHANGE_DEVICE_TOKEN:
      return {
        ...initState,
        deviceToken: action.payload
      };
    default:
      return state;
  }
}