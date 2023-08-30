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

const token = '3e29f1e3d9ee62471530ede8dc38dd339d12d098f3e586cc2cd7e3c86bc1c4b3ddcb4d1ef775a69228f8554c9924fc185cb9552738690169b824017c75967a1a22d94603db267997d7ce9ffebd15c77789ec60bb103cd211fa848b39feedf5cccf96dc8cb239f94415ae5ae87da69a60dbb7772a106bf0032bd51e90f2787725';


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
