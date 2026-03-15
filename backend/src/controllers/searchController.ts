import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const result = await pool.query(
      `SELECT id, username, avatar_url, bio, is_verified, badge, followers_count
       FROM users
       WHERE LOWER(username) LIKE LOWER($1) OR LOWER(bio) LIKE LOWER($1)
       ORDER BY followers_count DESC
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const searchPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const result = await pool.query(
      `SELECT p.id, p.photo_url, p.caption, p.user_id, u.username, u.avatar_url,
              COUNT(r.id) as rating_count, AVG(r.score) as avg_rating
       FROM photos p
       INNER JOIN users u ON p.user_id = u.id
       LEFT JOIN ratings r ON p.id = r.photo_id
       WHERE LOWER(p.caption) LIKE LOWER($1)
       GROUP BY p.id, u.id
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search photos error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getTrending = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.photo_url, p.caption, p.user_id, u.username, u.avatar_url,
              COUNT(r.id) as rating_count, AVG(r.score) as avg_rating
       FROM photos p
       INNER JOIN users u ON p.user_id = u.id
       LEFT JOIN ratings r ON p.id = r.photo_id
       WHERE p.created_at >= NOW() - INTERVAL '7 days'
       GROUP BY p.id, u.id
       HAVING COUNT(r.id) > 0
       ORDER BY COUNT(r.id) DESC
       LIMIT 20`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ error: 'Failed to get trending' });
  }
};

export const getRecommended = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT p.id, p.photo_url, p.caption, p.user_id, u.username, u.avatar_url,
              COUNT(r.id) as rating_count, AVG(r.score) as avg_rating
       FROM photos p
       INNER JOIN users u ON p.user_id = u.id
       INNER JOIN follows f ON p.user_id = f.following_id
       LEFT JOIN ratings r ON p.id = r.photo_id
       LEFT JOIN ratings ur ON p.id = ur.photo_id AND ur.user_id = $1
       WHERE f.follower_id = $1 AND ur.id IS NULL
       GROUP BY p.id, u.id
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get recommended error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
