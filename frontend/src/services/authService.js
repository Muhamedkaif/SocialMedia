import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  // Get current logged-in user
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  // Logout user
logout: async () => {
  await api.post('/api/auth/logout', {}, { withCredentials: true });
  localStorage.removeItem('user'); // optional (UI state)
},
};
