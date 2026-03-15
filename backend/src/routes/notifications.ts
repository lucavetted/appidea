import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.post('/mark-read', authenticate, markAsRead);
router.post('/mark-all-read', authenticate, markAllAsRead);
router.get('/unread-count', authenticate, getUnreadCount);
router.delete('/:notificationId', authenticate, deleteNotification);

export default router;
