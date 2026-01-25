import api from './api';

export const userService = {
  // Search users by query
  searchUsers: async (query) => {
    const response = await api.get('/api/users/search', {
      params: { query },
    });
    return response.data;
  },

  // Get user profile by username
  getUserProfile: async (username) => {
    const response = await api.get(`/api/users/${username}/profile`);
    return response.data;
  },

  // Get user's posts by username
  getUserPosts: async (username) => {
    const response = await api.get(`/api/users/${username}/posts`);
    return response.data;
  },
};
