import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000, // milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send authentication cookie automatically for each request
instance.interceptors.request.use((config: any) => {
  const userToken = Cookies.get('jwt');

  if (typeof userToken !== 'string') {
    return config;
  }

  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${userToken}` } };
});

export default instance;
