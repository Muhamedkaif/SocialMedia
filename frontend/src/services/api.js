import axios from 'axios';

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // Important for session-based auth
});

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
