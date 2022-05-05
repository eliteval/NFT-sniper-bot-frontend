const INITIAL_STATE = {
  loginToken: "",
  loginUserName: "",
 
};

const LoginReducer = (state = INITIAL_STATE, action) => {
  let loginToken;
  let loginUserName;
  
  let data;
  switch (action.type) {
    case "LOGIN_SUCCESS":
      data = action.loginData;
      loginToken = data.token;
      loginUserName = data.userInfo.public;    
      return {
        ...state,
        loginToken,
        loginUserName,       
      };
    
    case "LOGOUT_SUCCESS":
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
export default LoginReducer;
