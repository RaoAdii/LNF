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
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000;

const api = axios.create({
  baseURL: API_ROUTE,
  timeout: REQUEST_TIMEOUT_MS,
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

const shouldRetryRequest = (error) => {
  if (isNetworkError(error)) return true;
  const status = Number(error?.response?.status || 0);
  return status >= 500;
};

const requestWithRetry = async (requestFn, retries = 1, retryDelayMs = 350) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetryRequest(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }

  throw lastError;
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
  getAllPosts: (params, config = {}) =>
    requestWithRetry(() => api.get('/posts', { params, ...config }), 1),
  getPostById: (id) => requestWithRetry(() => api.get(`/posts/${id}`), 1),
  getMyPosts: () => requestWithRetry(() => api.get('/posts/my-posts'), 1),
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
  getInbox: () => requestWithRetry(() => api.get('/messages/inbox'), 1),
  getSentMessages: () => requestWithRetry(() => api.get('/messages/sent'), 1),
};

export const getConversations = () =>
  requestWithRetry(() => api.get('/messages/conversations'), 1);

export const getThread = (otherUserId, postId) =>
  requestWithRetry(() => api.get(`/messages/thread/${otherUserId}/${postId}`), 1);

export const replyMessage = (data) =>
  api.post('/messages/reply', data);

export const markThreadAsRead = (otherUserId, postId) =>
  api.put(`/messages/read/${otherUserId}/${postId}`);

export const adminAPI = {
  getStats: () => requestWithRetry(() => api.get('/admin/stats'), 1),
  getUsers: (params) => requestWithRetry(() => api.get('/admin/users', { params }), 1),
  getPosts: (params) => requestWithRetry(() => api.get('/admin/posts', { params }), 1),
  updatePostFlags: (postId, updates) => api.patch(`/admin/posts/${postId}`, updates),
  deletePost: (postId) => api.delete(`/admin/posts/${postId}`),
  toggleBanUser: (userId) => api.patch(`/admin/users/${userId}/ban`),
  toggleAdminRole: (userId) => api.patch(`/admin/users/${userId}/promote`),
};

export default api;
