import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { photo_id, content, parent_comment_id } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'INSERT INTO comments (photo_id, user_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [photo_id, userId, content, parent_comment_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { photo_id } = req.query;

    const result = await pool.query(`
      SELECT c.id, c.photo_id, c.user_id, c.content, c.parent_comment_id, c.created_at, c.updated_at,
             u.username, u.avatar_url,
             COUNT(DISTINCT cl.id) as likes,
             (SELECT COUNT(*) FROM comments WHERE parent_comment_id = c.id) as reply_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.photo_id = $1 AND c.parent_comment_id IS NULL
      GROUP BY c.id, u.username, u.avatar_url
      ORDER BY c.created_at DESC
    `, [photo_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

export const getReplies = async (req: AuthRequest, res: Response) => {
  try {
    const { comment_id } = req.params;

    const result = await pool.query(`
      SELECT c.id, c.photo_id, c.user_id, c.content, c.parent_comment_id, c.created_at, c.updated_at,
             u.username, u.avatar_url,
             COUNT(DISTINCT cl.id) as likes
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.parent_comment_id = $1
      GROUP BY c.id, u.username, u.avatar_url
      ORDER BY c.created_at ASC
    `, [comment_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get replies' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    // Check if user owns comment
    const commentCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if user owns comment
    const commentCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [id]);

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const likeComment = async (req: AuthRequest, res: Response) => {
  try {
    const { comment_id } = req.body;
    const userId = req.userId;

    // Check if already liked
    const existingLike = await pool.query(
      'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      [comment_id, userId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
        [comment_id, userId]
      );
      res.json({ liked: false });
    } else {
      // Like
      await pool.query(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)',
        [comment_id, userId]
      );
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to like comment' });
  }
};

export const getCommentLikes = async (req: AuthRequest, res: Response) => {
  try {
    const { comment_id } = req.params;

    const result = await pool.query(
      'SELECT COUNT(*) as likes FROM comment_likes WHERE comment_id = $1',
      [comment_id]
    );

    res.json({ likes: parseInt(result.rows[0].likes) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get likes' });
  }
};
