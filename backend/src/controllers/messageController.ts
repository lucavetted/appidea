import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipient_id, message_text } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, message_text) VALUES ($1, $2, $3) RETURNING *',
      [userId, recipient_id, message_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: otherUserId } = req.params;
    const userId = req.userId;

    const result = await pool.query(`
      SELECT id, sender_id, recipient_id, message_text, created_at
      FROM messages
      WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId, otherUserId]);

    res.json(result.rows.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(`
      SELECT DISTINCT
        CASE 
          WHEN sender_id = $1 THEN recipient_id
          ELSE sender_id
        END as user_id,
        (SELECT username FROM users u WHERE u.id = CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END) as username,
        (SELECT avatar_url FROM users u WHERE u.id = CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END) as avatar_url,
        MAX(created_at) as last_message_at
      FROM messages
      WHERE sender_id = $1 OR recipient_id = $1
      GROUP BY CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END
      ORDER BY MAX(created_at) DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};
