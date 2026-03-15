import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing, isFollowing } from '../controllers/followController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/follow', authenticate, followUser);
router.post('/unfollow', authenticate, unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/is-following/:followingId', authenticate, isFollowing);

export default router;
