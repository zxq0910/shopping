import axios from 'axios';
import { message } from 'antd';
import { useAppStore } from '@/store/appStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const request = axios.create({
  baseURL,
  timeout: 20000
});

request.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error.message || '请求失败';

    if (status === 401) {
      const store = useAppStore.getState();
      store.logout();
      message.error('登录状态已失效，请重新登录');
      if (location.pathname !== '/login' && location.pathname !== '/admin/login') {
        location.href = '/login';
      }
    } else {
      message.error(msg);
    }

    return Promise.reject(error);
  }
);
