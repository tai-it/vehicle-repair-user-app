import * as Types from './types'

const initState = {
  isDarkMode: false,
  backgroundColor: '#1565c0',
  textColor: 'white',
  deviceToken: '',
  isStarted: false
}

export default appReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.CHANGE_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
        backgroundColor: action.payload ? '#323235' : '#1565c0',
        textColor: action.payload ? 'white' : 'white'
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