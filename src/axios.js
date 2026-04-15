import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Connect to our Java Backend!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request if we are logged in
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;