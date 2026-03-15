import express from 'express';
import { savePhoto, unsavePhoto, getSavedPhotos, isSaved } from '../controllers/savedController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/save', authenticate, savePhoto);
router.post('/unsave', authenticate, unsavePhoto);
router.get('/saved', authenticate, getSavedPhotos);
router.get('/is-saved/:photoId', authenticate, isSaved);

export default router;
