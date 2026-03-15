import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import '../styles/Notifications.css';

interface Notification {
  id: number;
  type: string;
  actor_username?: string;
  actor_avatar?: string;
  photo_caption?: string;
  comment_content?: string;
  read: boolean;
  created_at: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(10, offset);
      setNotifications((prev) =>
        offset === 0 ? response.data : [...prev, ...response.data]
      );
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      loadUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👤';
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'rating':
        return '⭐';
      default:
        return '📢';
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'follow':
        return `${notification.actor_username} started following you`;
      case 'like':
        return `${notification.actor_username} liked your photo`;
      case 'comment':
        return `${notification.actor_username} commented on your photo`;
      case 'rating':
        return `${notification.actor_username} rated your photo`;
      default:
        return 'You have a new notification';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>

      {unreadCount > 0 && (
        <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      )}

      {loading && offset === 0 && <div className="loading">Loading notifications...</div>}

      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-text">
                  <p className="notification-message">
                    {getNotificationMessage(notification)}
                  </p>
                  {notification.photo_caption && (
                    <p className="notification-detail">"{notification.photo_caption}"</p>
                  )}
                  {notification.comment_content && (
                    <p className="notification-detail">"{notification.comment_content}"</p>
                  )}
                  <p className="notification-time">
                    {new Date(notification.created_at).toLocaleDateString()}{' '}
                    {new Date(notification.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="action-btn mark-read"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ●
                  </button>
                )}
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(notification.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Notifications</h2>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        )
      )}

      {notifications.length > 0 && !loading && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={() => {
              setOffset((prev) => prev + 10);
              loadNotifications();
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
