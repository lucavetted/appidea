import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  sendMessage,
  getConversation,
  getConversations,
} from '../controllers/messageController';

const router = express.Router();

router.post('/', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/:userId', authenticate, getConversation);

export default router;
