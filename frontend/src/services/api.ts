import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  signup: (email: string, password: string, username: string) =>
    api.post('/auth/signup', { email, password, username }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// User services
export const userService = {
  getProfile: (id: number) => api.get(`/users/profile/${id}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

// Photo services
export const photoService = {
  uploadPhoto: (photo_url: string, caption: string) =>
    api.post('/photos', { photo_url, caption }),
  getPhotos: (limit = 10, offset = 0) =>
    api.get('/photos', { params: { limit, offset } }),
  getPhotoById: (id: number) => api.get(`/photos/${id}`),
  deletePhoto: (id: number) => api.delete(`/photos/${id}`),
};

// Rating services
export const ratingService = {
  createRating: (photo_id: number, score: number, comment: string) =>
    api.post('/ratings', { photo_id, score, comment }),
  getRatings: (photo_id: number) =>
    api.get('/ratings', { params: { photo_id } }),
  updateRating: (id: number, score: number, comment: string) =>
    api.put(`/ratings/${id}`, { score, comment }),
  deleteRating: (id: number) => api.delete(`/ratings/${id}`),
};

// Message services
export const messageService = {
  sendMessage: (recipient_id: number, message_text: string) =>
    api.post('/messages', { recipient_id, message_text }),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId: number) => api.get(`/messages/${userId}`),
};

// Comment services
export const commentService = {
  createComment: (photo_id: number, content: string, parent_comment_id?: number) =>
    api.post('/comments', { photo_id, content, parent_comment_id }),
  getComments: (photo_id: number) =>
    api.get('/comments', { params: { photo_id } }),
  getReplies: (comment_id: number) =>
    api.get(`/comments/replies/${comment_id}`),
  updateComment: (id: number, content: string) =>
    api.put(`/comments/${id}`, { content }),
  deleteComment: (id: number) => api.delete(`/comments/${id}`),
  likeComment: (comment_id: number) =>
    api.post('/comments/like', { comment_id }),
  getCommentLikes: (comment_id: number) =>
    api.get(`/comments/likes/${comment_id}`),
};
