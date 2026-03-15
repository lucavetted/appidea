import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photo_url, caption, file_data } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let finalPhotoUrl = photo_url;

    if (file_data) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file_data, {
          folder: 'chopped-or-not/photos',
          resource_type: 'auto',
        });
        finalPhotoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image to cloud' });
      }
    }

    const result = await pool.query(
      'INSERT INTO photos (user_id, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [userId, finalPhotoUrl, caption]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

export const getPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(`
      SELECT p.id, p.user_id, p.photo_url, p.caption, p.created_at,
             u.username, u.avatar_url,
             COUNT(r.id) as total_ratings,
             AVG(r.score) as average_rating
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN ratings r ON p.id = r.photo_id
      GROUP BY p.id, u.username, u.avatar_url
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get photos' });
  }
};

export const getPhotoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT p.id, p.user_id, p.photo_url, p.caption, p.created_at,
             u.username, u.avatar_url,
             COUNT(r.id) as total_ratings,
             AVG(r.score) as average_rating
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN ratings r ON p.id = r.photo_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, u.avatar_url
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get photo' });
  }
};

export const deletePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const photoCheck = await pool.query(
      'SELECT user_id FROM photos WHERE id = $1',
      [id]
    );

    if (photoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photoCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM photos WHERE id = $1', [id]);

    res.json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
};
