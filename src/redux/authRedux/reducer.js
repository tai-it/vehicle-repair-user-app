import * as Types from './types'

const initState = {
  authenticated: false,
  user: null,
}

export default authReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.LOGIN_SUCCEEDED:
      return {
        ...initState,
        authenticated: true,
        user: action.payload,
      };
    case Types.SIGNUP_SUCCEEDED:
      return {
        ...initState,
        authenticated: true,
        user: action.payload,
      };
    case Types.LOGOUT:
      return {
        ...initState
      };
    default:
      return state;
  }
};