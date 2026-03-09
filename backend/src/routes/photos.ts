import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
} from '../controllers/photoController';

const router = express.Router();

router.post('/', authenticate, uploadPhoto);
router.get('/', getPhotos);
router.get('/:id', getPhotoById);
router.delete('/:id', authenticate, deletePhoto);

export default router;
