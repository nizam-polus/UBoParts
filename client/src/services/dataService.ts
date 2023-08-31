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

const token = '253330d427dce6ac20fa8dfd65567dde0d4730e6558404aaf866041f8827b29da3e4bcf71ad37338ccf9fb4ae79eb160902b7ebb654699229bc691ae0b6ba94b18c832e3ac28613b6ddaa98d218527ffc356f166f5f47de87c90f0af639f353eafbdc7b709f4286fbc4e49ef73234eeaceafbe271662c8366eaf39832a907cc2';


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
