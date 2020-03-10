import * as Types from './types'

export const changeColor = color => {
  return {
    type: Types.CHANGE_APP_COLOR,
    payload: color
  }
}