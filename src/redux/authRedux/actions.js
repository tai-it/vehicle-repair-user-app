import { LOGIN_SUCCEEDED, SIGNUP_SUCCEEDED, LOGOUT, UPDATE_PROFILE_SUCCEEDED } from "./types";

export const loginSucceeded = user => {
  return {
    type: LOGIN_SUCCEEDED,
    payload: user
  }
}

export const signupSucceeded = user => {
  return {
    type: SIGNUP_SUCCEEDED,
    payload: user
  }
}

export const logout = () => {
  return { type: LOGOUT }
}

export const updateProfileSucceeded = user => {
  return {
    type: UPDATE_PROFILE_SUCCEEDED,
    payload: user
  }
}