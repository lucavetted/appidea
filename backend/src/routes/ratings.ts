import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createRating,
  getRatings,
  updateRating,
  deleteRating,
} from '../controllers/ratingController';

const router = express.Router();

router.post('/', authenticate, createRating);
router.get('/', getRatings);
router.put('/:id', authenticate, updateRating);
router.delete('/:id', authenticate, deleteRating);

export default router;
