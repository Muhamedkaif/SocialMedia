import api from './api';

export const postService = {
  // Get all posts (feed)
  getAllPosts: async () => {
    const response = await api.get('/api/posts/getAll');
    return response.data;
  },

  // Create a new post (TEXT + IMAGE)
  createPost: async (formData) => {
    const response = await api.post(
      '/api/posts/create',
      formData
    );
    
    return response.data;
  },

  // Delete a post by ID
  deletePost: async (postId) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },
};
