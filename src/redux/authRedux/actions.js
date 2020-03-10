import { LOGIN_SUCCEEDED, SIGNUP_SUCCEEDED, LOGOUT } from "./types";

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
  console.log('Logging out');
  return { type: LOGOUT }
}