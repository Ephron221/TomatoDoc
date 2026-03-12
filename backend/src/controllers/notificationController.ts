import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const [notifications] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM notifications WHERE user_id = ? OR (target = "user" AND user_id IS NULL) ORDER BY created_at DESC LIMIT 50',
      [userId ?? null]
    );

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND (user_id = ? OR (target = "user" AND user_id IS NULL))',
      [id, userId ?? null]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
