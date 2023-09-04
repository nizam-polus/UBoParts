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

const token = 'f96cd04ee68e771ae6297c8566a05072d936afb7d4412210edd955b593b513ce3e0094db9ed7f4aac90defa23d3384c379a349f6254cb5a5e504cc29af29ca848266ead47425946b13dce5a873fd0168758cf243b274652265958e51dfbb95b123f32542e6876b0a307c4f0289721fb5bf0d6ba6badc54e0ac43f29ea023f99b';


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
