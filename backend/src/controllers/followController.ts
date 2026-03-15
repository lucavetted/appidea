import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { getIO } from '../utils/ioInstance';

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user?.userId;

    if (!followerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existing = await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [followerId, followingId]
    );

    await pool.query(
      'UPDATE users SET following_count = following_count + 1 WHERE id = $1',
      [followerId]
    );

    await pool.query(
      'UPDATE users SET followers_count = followers_count + 1 WHERE id = $1',
      [followingId]
    );

    await pool.query(
      'INSERT INTO notifications (user_id, actor_id, type) VALUES ($1, $2, $3)',
      [followingId, followerId, 'follow']
    );

    const io = getIO();
    if (io) {
      io.to(`user_${followingId}`).emit('new_notification', {
        type: 'follow',
        actor_id: followerId,
        message: 'Someone started following you',
      });
    }

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Follow failed' });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user?.userId;

    if (!followerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    await pool.query(
      'UPDATE users SET following_count = following_count - 1 WHERE id = $1',
      [followerId]
    );

    await pool.query(
      'UPDATE users SET followers_count = followers_count - 1 WHERE id = $1',
      [followingId]
    );

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Unfollow failed' });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.avatar_url, u.bio FROM users u
       INNER JOIN follows f ON u.id = f.follower_id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to get followers' });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.avatar_url, u.bio FROM users u
       INNER JOIN follows f ON u.id = f.following_id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to get following' });
  }
};

export const isFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user?.userId;

    if (!followerId) {
      return res.json({ isFollowing: false });
    }

    const result = await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    res.json({ isFollowing: result.rows.length > 0 });
  } catch (error) {
    console.error('Is following error:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
};
