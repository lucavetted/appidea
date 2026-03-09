import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment,
  likeComment,
  getCommentLikes,
} from '../controllers/commentController';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/', getComments);
router.get('/replies/:comment_id', getReplies);
router.get('/likes/:comment_id', getCommentLikes);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);
router.post('/like', authenticate, likeComment);

export default router;
