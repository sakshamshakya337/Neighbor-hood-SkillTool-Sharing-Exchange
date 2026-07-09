import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: if there's no response (network error, CORS, server down),
    // skip the refresh logic and reject with a user-friendly error
    if (!error.response) {
      return Promise.reject(
        new Error('Unable to reach the server. Please check your connection.')
      );
    }

    // Skip refresh token retry for auth endpoints to avoid infinite loops
    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/');
    
    if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        if (data.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          localStorage.setItem('accessToken', data.accessToken);
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed — clear local auth state
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
