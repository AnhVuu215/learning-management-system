import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem('lms_refresh');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    refreshPromise = axios.post(
      `${API_BASE}/auth/refresh-token`,
      { refreshToken },
      { withCredentials: true }
    );
  }

  try {
    const response = await refreshPromise;
    const payload = response.data.data;
    localStorage.setItem('lms_token', payload.tokens.accessToken);
    localStorage.setItem('lms_refresh', payload.tokens.refreshToken);
    localStorage.setItem('lms_user', JSON.stringify(payload.user));
    return payload.tokens.accessToken;
  } finally {
    refreshPromise = null;
  }
};

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_refresh');
        localStorage.removeItem('lms_user');
      }
    }
    const message = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default http;

