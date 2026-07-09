import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Ensure the original request uses the new token if you're passing it in headers,
        // but since we are using cookies, the browser handles it automatically on the next request.
        // However, if using Bearer, we'd set it here.
        if (data.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          // Also set the global default
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (e.g. expired or not present)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
