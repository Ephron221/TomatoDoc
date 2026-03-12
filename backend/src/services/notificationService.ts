import pool from '../config/db';

export const createNotification = async (target: 'admin' | 'user', title: string, message: string, userId: number | null = null) => {
  try {
    await pool.execute(
      'INSERT INTO notifications (target, user_id, title, message) VALUES (?, ?, ?, ?)',
      [target, userId, title, message]
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const notifyAdmin = (title: string, message: string) => {
  return createNotification('admin', title, message);
};

export const notifyUser = (userId: number, title: string, message: string) => {
  return createNotification('user', title, message, userId);
};
