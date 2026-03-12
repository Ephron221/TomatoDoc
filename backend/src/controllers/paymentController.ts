import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const submitPayment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { full_name, email, phone, plan, amount, payment_method } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Payment proof is required' });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO payments (user_id, full_name, email, phone, plan, amount, payment_method, proof_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId ?? null, full_name, email, phone, plan, amount, payment_method, file.path]
    );

    // Create notification for admin
    await pool.execute(
      'INSERT INTO notifications (target, title, message) VALUES ("admin", "New Payment Submitted", ?)',
      [`Farmer ${full_name} submitted a ${plan} payment of ${amount} RWF.`]
    );

    res.status(201).json({
      message: 'Payment proof submitted successfully. Admin will review it within 24 hours.',
      paymentId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment submission failed' });
  }
};

export const getUserPayments = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const [payments] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY submitted_at DESC',
      [userId ?? null]
    );

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
