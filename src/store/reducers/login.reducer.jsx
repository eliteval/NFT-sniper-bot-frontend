const INITIAL_STATE = {
  loginToken: "",
  loginUserName: "",
  isAdmin: false,
};

const LoginReducer = (state = INITIAL_STATE, action) => {
  let loginToken;
  let loginUserName;
  let isAdmin;
  
  let data;
  switch (action.type) {
    case "SET_LOGIN_SUCCESS":
      data = action.loginData;
      loginToken = data.token;
      loginUserName = data.userInfo.public;    
      isAdmin = data.isAdmin;    
      return {
        ...state,
        loginToken,
        loginUserName,      
        isAdmin 
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
