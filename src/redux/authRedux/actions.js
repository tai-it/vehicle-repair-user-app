import * as Types from "./types";

export const loginRequest = user => {
  return {
    type: Types.LOGIN_REQUEST,
    payload: user
  }
}

export const signupRequest = user => {
  return {
    type: Types.SIGNUP_REQUEST,
    payload: user
  }
}

export const phoneConfirmed = () => {
  return {
    type: Types.PHONE_CONFIRMED
  }
}

export const fetchProfileRequest = token => {
  return {
    type: Types.FETCH_PROFILE_REQUEST,
    payload: token
  }
}

// export const loginSucceeded = user => {
//   return {
//     type: Types.LOGIN_SUCCEEDED,
//     payload: user
//   }
// }

// export const signupSucceeded = user => {
//   return {
//     type: Types.SIGNUP_SUCCEEDED,
//     payload: user
//   }
// }

export const logout = () => {
  return { type: Types.LOGOUT }
}

// export const updateProfileSucceeded = user => {
//   return {
//     type: Types.UPDATE_PROFILE_SUCCEEDED,
//     payload: user
//   }
// }