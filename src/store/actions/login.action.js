import * as types from "./types";

export const LoginSuccess = (loginData) => ({
  type: types.LOGIN_SUCCESS,
  loginData,
});

export const LogOutSuccess = () => ({
  type: types.LOGOUT_SUCCESS,
});
