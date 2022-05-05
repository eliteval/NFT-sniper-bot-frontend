import axios from 'axios';

function ApiCall(constant, method, token, reqBody, headers) {
  return axios({
    method,
    url: `${constant}`,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    data: reqBody,
  });
}

export default ApiCall;
