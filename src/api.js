import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cupbearer-overcast-domain.ngrok-free.dev/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = Bearer ${token};
  }
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});

export default API;

