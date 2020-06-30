import * as Types from './types'

const initState = {
  loading: false,
  updating: false,
  authenticated: false,
  user: null,
  token: "",
  errors: [],
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
        authenticated: true,
        token: action.payload.token,
      };
    case Types.LOGIN_FAILED:
      return {
        ...initState,
        loading: false,
        message: action.payload.message
      };
    case Types.SIGNUP_REQUEST:
      return {
        ...initState,
        loading: true
      };
    case Types.SIGNUP_SUCCEEDED:
      return {
        ...initState,
        authenticated: true,
        token: action.payload.token,
      };
    case Types.SIGNUP_FAILED:
      return {
        ...initState,
        loading: false,
        message: action.payload.message,
        errors: action.payload.errors,
      };
    case Types.FETCH_PROFILE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case Types.FETCH_PROFILE_SUCCEEDED:
      return {
        ...state,
        loading: false,
        user: action.payload.user
      };
    case Types.FETCH_PROFILE_FAILED:
      return {
        ...initState,
        message: "Phiên đã hết hạn, vui lòng đăng nhập lại"
      };
    case Types.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updating: true
      };
    case Types.UPDATE_PROFILE_SUCCEEDED:
      return {
        ...state,
        updating: false,
        user: action.payload.user
      };
    case Types.UPDATE_PROFILE_FAILED:
      return {
        ...state,
        updating: false,
        message: action.payload.message,
        errors: action.payload.errors,
      };
    case Types.CLEAR_ERROR_STATE:
      return {
        ...state,
        loading: false,
        errors: [],
        message: ""
      };
    case Types.UPDATE_DEVICE_TOKEN_SUCCEEDED:
      return {
        ...state,
        user: {
          ...state.user,
          deviceToken: action.payload.deviceToken
        }
      };
    case Types.LOGOUT:
      return {
        ...initState
      };
    default:
      return state;
  }
};