import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  getLeaderboard,
} from '../controllers/userController';

const router = express.Router();

router.get('/profile/:id', getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/leaderboard', getLeaderboard);

export default router;
