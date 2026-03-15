import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (email: string, password: string, username: string) =>
    api.post('/auth/signup', { email, password, username }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  verifyEmail: (userId: number, code: string) =>
    api.post('/auth/verify-email', { userId, code }),
};

export const userService = {
  getProfile: (id: number) => api.get(`/users/profile/${id}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

export const photoService = {
  uploadPhoto: (photo_url: string, caption: string) =>
    api.post('/photos', { photo_url, caption }),
  getPhotos: (limit = 10, offset = 0) =>
    api.get('/photos', { params: { limit, offset } }),
  getPhotoById: (id: number) => api.get(`/photos/${id}`),
  deletePhoto: (id: number) => api.delete(`/photos/${id}`),
};

export const ratingService = {
  createRating: (photo_id: number, score: number, comment: string) =>
    api.post('/ratings', { photo_id, score, comment }),
  getRatings: (photo_id: number) =>
    api.get('/ratings', { params: { photo_id } }),
  updateRating: (id: number, score: number, comment: string) =>
    api.put(`/ratings/${id}`, { score, comment }),
  deleteRating: (id: number) => api.delete(`/ratings/${id}`),
};

export const messageService = {
  sendMessage: (recipient_id: number, message_text: string) =>
    api.post('/messages', { recipient_id, message_text }),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId: number) => api.get(`/messages/${userId}`),
};

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

export const followService = {
  followUser: (following_id: number) =>
    api.post('/follows/follow', { following_id }),
  unfollowUser: (following_id: number) =>
    api.post('/follows/unfollow', { following_id }),
  getFollowers: (userId: number) =>
    api.get(`/follows/followers/${userId}`),
  getFollowing: (userId: number) =>
    api.get(`/follows/following/${userId}`),
  isFollowing: (followingId: number) =>
    api.get(`/follows/is-following/${followingId}`),
};

export const saveService = {
  savePhoto: (photo_id: number) =>
    api.post('/saved/save', { photo_id }),
  unsavePhoto: (photo_id: number) =>
    api.post('/saved/unsave', { photo_id }),
  getSavedPhotos: (limit = 10, offset = 0) =>
    api.get('/saved/saved', { params: { limit, offset } }),
  isSaved: (photoId: number) =>
    api.get(`/saved/is-saved/${photoId}`),
};

export const searchService = {
  searchUsers: (query: string) =>
    api.get('/search/users', { params: { query } }),
  searchPhotos: (query: string) =>
    api.get('/search/photos', { params: { query } }),
  getTrending: (limit = 20) =>
    api.get('/search/trending', { params: { limit } }),
  getRecommended: (limit = 20) =>
    api.get('/search/recommended', { params: { limit } }),
};

export const notificationService = {
  getNotifications: (limit = 20, offset = 0) =>
    api.get('/notifications/', { params: { limit, offset } }),
  markAsRead: (notificationId: number) =>
    api.post(`/notifications/mark-read`, { notificationId }),
  markAllAsRead: () =>
    api.post('/notifications/mark-all-read'),
  getUnreadCount: () =>
    api.get('/notifications/unread-count'),
  deleteNotification: (notificationId: number) =>
    api.delete(`/notifications/${notificationId}`),
};