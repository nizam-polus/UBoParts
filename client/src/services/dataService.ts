import axios from 'axios'
// import { getSession } from 'next-auth/client';
// import  { getItem, setItem } from '../utility/localStorageControl'

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

//get token from session and store in localstorage
// getSession().then( (user: any) => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('token', user.accessToken)
//   }
// })
// .catch((err: any) => console.log(err))

const token = '82e814a62e2ecaf5eb159655ce6ccddccd3e1b4b211e21290bbf57423725b24827db9e4627748fc3fd4620b315d816b787dee5aacd6ce6da0167bd1b73c3051c0c99f5bee4dfe3e3b32f19c244f234cf60dc30839976928b1b264e907cdbd5fcd270731381261c1c9fcfa73d82083fde98305f6d37ef34c7e3799a424fd29ffe';


if (typeof window !== 'undefined') {
  localStorage.setItem('token', token)
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
}

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
});

class DataService {
  static get(path = '') {
    return client({
      method: 'GET',
      url: path,
      headers: { ...authHeader() },
    });
  }

  static post(path = '', data = {}, optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static put(path = '', data = {}) {
    return client({
      method: 'PUT',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }


  static delete(path = '', data = {}) {
    return client({
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use(config => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig: any = config;
  const { headers } = config;
  requestConfig.headers = { ...headers, Authorization: `Bearer ${getToken()}` };

  return requestConfig;
});

client.interceptors.response.use(
  response => response,
  error => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;
    const originalRequest = error.config;
    if (response) {
      switch (response.status) {
        case 500:
          console.log("Error en el servidor", response);
          break;
        case 401:
          //handle session expire here
          return response;
        default:
          return originalRequest;
      }
    }
    return Promise.reject(error);
  },
);
export { DataService };
