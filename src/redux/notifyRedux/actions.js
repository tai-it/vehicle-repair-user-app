import * as Types from './types'

export const fetchNotifications = (pageIndex = 1) => {
  return {
    type: Types.FETCH_NOTIFICATIONS_REQUEST,
    payload: pageIndex
  }
}