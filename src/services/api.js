// src/services/api.js
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8080', // 根据你的后端实际 URL 配置
    timeout: 10000,
});

export default api

// 添加请求拦截器
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 添加响应拦截器
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);