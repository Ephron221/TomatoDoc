import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const checkSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  try {
    const [subscriptions] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM subscriptions WHERE user_id = ? AND is_active = TRUE ORDER BY end_date DESC LIMIT 1',
      [userId ?? null]
    );

    if (subscriptions.length === 0) {
      return res.status(403).json({ message: 'No active subscription found. Please subscribe to use this feature.' });
    }

    const sub = (subscriptions as RowDataPacket[])[0];
    const today = new Date().toISOString().split('T')[0];

    // Check if subscription has expired
    if (new Date(sub.end_date) < new Date(today)) {
      await pool.execute('UPDATE subscriptions SET is_active = FALSE WHERE id = ?', [sub.id]);
      return res.status(403).json({ message: 'Your subscription has expired. Please renew it.' });
    }

    // Check daily limits for trial plan
    if (sub.plan === 'trial') {
      const lastImageDate = sub.last_image_date ? new Date(sub.last_image_date).toISOString().split('T')[0] : null;
      
      let imagesUsedToday = sub.images_used_today;
      if (lastImageDate !== today) {
        imagesUsedToday = 0;
        await pool.execute('UPDATE subscriptions SET images_used_today = 0, last_image_date = ? WHERE id = ?', [today, sub.id]);
      }

      if (imagesUsedToday >= 10) {
        return res.status(403).json({ message: 'Daily limit reached for free trial (10 images). Upgrade to a paid plan for unlimited access.' });
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
