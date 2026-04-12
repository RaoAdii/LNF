import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_ROUTE = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_ROUTE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Post endpoints
export const postAPI = {
  getAllPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  getMyPosts: () => api.get('/posts/my-posts'),
  createPost: (data) => api.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (id, data) => api.put(`/posts/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Message endpoints
export const messageAPI = {
  sendMessage: (data) => api.post('/messages', data),
  getInbox: () => api.get('/messages/inbox'),
  getSentMessages: () => api.get('/messages/sent'),
};

export const getConversations = () =>
  api.get('/messages/conversations');

export const getThread = (otherUserId, postId) =>
  api.get(`/messages/thread/${otherUserId}/${postId}`);

export const replyMessage = (data) =>
  api.post('/messages/reply', data);

export const markThreadAsRead = (otherUserId, postId) =>
  api.put(`/messages/read/${otherUserId}/${postId}`);

export default api;
