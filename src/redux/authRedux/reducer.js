import * as Types from './types'

const initState = {
  loading: false,
  authenticated: false,
  user: null,
  token: "",
  error: null,
  message: ""
}

export default authReducer = (state = initState, action) => {
  switch (action.type) {
    case Types.LOGIN_REQUEST:
      return {
        ...initState,
        loading: true
      };
    case Types.LOGIN_SUCCEEDED:
      return {
        ...initState,
        loading: false,
        authenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case Types.LOGIN_FAILED:
      return {
        ...initState,
        loading: false,
        error: action.payload
      };
    case Types.SIGNUP_REQUEST:
      return {
        ...initState,
        loading: true
      };
    case Types.SIGNUP_SUCCEEDED:
      return {
        ...initState,
        loading: false,
        authenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case Types.SIGNUP_FAILED:
      return {
        ...initState,
        loading: false,
        error: action.payload
      };
    case Types.CLEAR_ERROR_STATE:
      return {
        ...state,
        error: null
      };
    case Types.LOGOUT:
      return {
        ...initState
      };
    default:
      return state;
  }
};