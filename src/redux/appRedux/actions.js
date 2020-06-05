import * as Types from './types'

export const changeColor = color => {
  return {
    type: Types.CHANGE_APP_COLOR,
    payload: color
  }
}

export const changeDeviceToken = token => {
  return {
    type: Types.CHANGE_DEVICE_TOKEN,
    payload: token
  }
}