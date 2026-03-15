import express from 'express';
import { searchUsers, searchPhotos, getTrending, getRecommended } from '../controllers/searchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/users', searchUsers);
router.get('/photos', searchPhotos);
router.get('/trending', getTrending);
router.get('/recommended', authenticate, getRecommended);

export default router;
