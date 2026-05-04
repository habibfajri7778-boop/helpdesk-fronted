import axios from 'axios';

const API = axios.create({
  baseURL: 'https:///cupbearer-overcast-doamin.ngrok-free.dev/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['ngrok-ski-browser-warning'] = 'true';
  return config;
});

export default API;
