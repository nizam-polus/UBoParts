// axiosInterceptor.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.31:1337/api/', // Replace this with your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request configuration here, e.g., add headers
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
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
