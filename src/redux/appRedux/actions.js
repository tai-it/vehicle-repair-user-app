import * as Types from './types'

export const changeColor = color => {
  return {
    type: Types.CHANGE_APP_COLOR,
    payload: color
  }
}

export const changeDarkMode = value => {
  return {
    type: Types.CHANGE_DARK_MODE,
    payload: value
  }
}

export const changeDeviceToken = token => {
  return {
    type: Types.CHANGE_DEVICE_TOKEN,
    payload: token
  }
}

export const getStarted = () => {
  return {
    type: Types.GET_STARTED
  }
}