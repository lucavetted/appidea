import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, username, bio, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatar_url } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'UPDATE users SET username = $1, bio = $2, avatar_url = $3 WHERE id = $4 RETURNING id, email, username, bio, avatar_url',
      [username, bio, avatar_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.username, u.avatar_url,
             COUNT(r.id) as total_ratings,
             AVG(r.score) as average_rating
      FROM users u
      LEFT JOIN ratings r ON u.id = r.photo_user_id
      GROUP BY u.id, u.username, u.avatar_url
      ORDER BY average_rating DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};
