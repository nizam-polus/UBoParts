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

const token = 'c1a67f132c0096d1c361d9f741c0671857ddb6d921b5bf2b84c8b743eca02ed0ea616d2ef3b81cd96eb2c4901b70d3a8449f797336931aadeff00b59c76202ba23cedcfa9456db2bd27ac43a4f3f106987541bb9dc7fb5633fac08f4a988478e3cdd87b1acc073bd818d10bdc00a6f7474245cc4a981cf931f0b86268e6a3dbd';


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
