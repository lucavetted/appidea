import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    const { photo_id, score, comment } = req.body;
    const userId = req.userId;

    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE photo_id = $1 AND user_id = $2',
      [photo_id, userId]
    );

    if (existingRating.rows.length > 0) {
      return res.status(400).json({ error: 'You already rated this photo' });
    }

    const result = await pool.query(
      'INSERT INTO ratings (photo_id, user_id, score, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [photo_id, score, userId, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rating' });
  }
};

export const getRatings = async (req: AuthRequest, res: Response) => {
  try {
    const { photo_id } = req.query;

    const result = await pool.query(`
      SELECT r.id, r.score, r.comment, r.created_at,
             u.id as user_id, u.username, u.avatar_url
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.photo_id = $1
      ORDER BY r.created_at DESC
    `, [photo_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ratings' });
  }
};

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;
    const userId = req.userId;

    const ratingCheck = await pool.query(
      'SELECT user_id FROM ratings WHERE id = $1',
      [id]
    );

    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (ratingCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      'UPDATE ratings SET score = $1, comment = $2 WHERE id = $3 RETURNING *',
      [score, comment, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const ratingCheck = await pool.query(
      'SELECT user_id FROM ratings WHERE id = $1',
      [id]
    );

    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (ratingCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);

    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rating' });
  }
};
