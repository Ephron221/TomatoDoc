import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket } from 'mysql2';

export const getMySubscription = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const [subscriptions] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM subscriptions WHERE user_id = ? AND is_active = TRUE ORDER BY end_date DESC LIMIT 1',
      [userId ?? null]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscriptions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscriptionHistory = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const [history] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY start_date DESC',
            [userId ?? null]
        );
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
