import axios from 'axios';

const normalizeBaseUrl = (url) => (url || '').trim().replace(/\/$/, '');

const resolveDefaultApiBase = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // In production, default to same-origin when VITE_API_URL is not provided.
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'http://localhost:5000';
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL) || resolveDefaultApiBase();
const API_ROUTE = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_ROUTE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const isNetworkError = (error) =>
  !error?.response && (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error');

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong') => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (isNetworkError(error)) {
    return 'Unable to connect to server. Please check your network and server status.';
  }

  return fallbackMessage;
};

export const resolveAssetUrl = (assetPath, fallback = '/placeholder.svg') => {
  if (!assetPath) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(assetPath) || assetPath.startsWith('data:') || assetPath.startsWith('blob:')) {
    return assetPath;
  }

  return `${API_BASE_URL}${assetPath.startsWith('/') ? '' : '/'}${assetPath}`;
};

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
