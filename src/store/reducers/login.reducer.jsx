const INITIAL_STATE = {
  loginToken: "",
  loginUserName: "",
  isManager: false,
  blockAT: false,
};

const LoginReducer = (state = INITIAL_STATE, action) => {
  let loginToken;
  let loginUserName;
  let isManager;
  let blockAT;
  
  let data;
  switch (action.type) {
    case "SET_LOGIN_SUCCESS":
      data = action.loginData;
      loginToken = data.token;
      loginUserName = data.userInfo.public;    
      isManager = data.isManager;    
      blockAT = data.blockAT;    
      return {
        ...state,
        loginToken,
        loginUserName,      
        isManager, 
        blockAT,
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
