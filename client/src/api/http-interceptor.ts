// axiosInterceptor.js
import axios from 'axios';
import { BASE_URL } from '../../configuration'

const axiosInstance = axios.create({
  baseURL: BASE_URL + '/api/', // Replace this with your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request configuration here, e.g., add headers
    config.headers.Authorization = `Bearer ${localStorage.getItem('usertoken')}`;
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response data or do other actions
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
