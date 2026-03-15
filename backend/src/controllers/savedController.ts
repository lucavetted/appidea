import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const savePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photoId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const existing = await pool.query(
      'SELECT * FROM saved_photos WHERE user_id = $1 AND photo_id = $2',
      [userId, photoId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Photo already saved' });
    }

    await pool.query(
      'INSERT INTO saved_photos (user_id, photo_id) VALUES ($1, $2)',
      [userId, photoId]
    );

    res.json({ message: 'Photo saved successfully' });
  } catch (error) {
    console.error('Save photo error:', error);
    res.status(500).json({ error: 'Failed to save photo' });
  }
};

export const unsavePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photoId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'DELETE FROM saved_photos WHERE user_id = $1 AND photo_id = $2',
      [userId, photoId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Photo not saved' });
    }

    res.json({ message: 'Photo removed from saved' });
  } catch (error) {
    console.error('Unsave photo error:', error);
    res.status(500).json({ error: 'Failed to unsave photo' });
  }
};

export const getSavedPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT p.id, p.photo_url, p.caption, p.user_id, u.username, u.avatar_url
       FROM photos p
       INNER JOIN saved_photos sp ON p.id = sp.photo_id
       INNER JOIN users u ON p.user_id = u.id
       WHERE sp.user_id = $1
       ORDER BY sp.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get saved photos error:', error);
    res.status(500).json({ error: 'Failed to get saved photos' });
  }
};

export const isSaved = async (req: AuthRequest, res: Response) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.json({ isSaved: false });
    }

    const result = await pool.query(
      'SELECT * FROM saved_photos WHERE user_id = $1 AND photo_id = $2',
      [userId, photoId]
    );

    res.json({ isSaved: result.rows.length > 0 });
  } catch (error) {
    console.error('Is saved error:', error);
    res.status(500).json({ error: 'Failed to check save status' });
  }
};
