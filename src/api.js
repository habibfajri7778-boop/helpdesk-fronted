import axios from 'axios';

const API = axios.create({
  baseURL: 'https://helpdesk-backed-44jk.vercel.app/api',
});

// Otomatis tambahkan token ke setiap request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
