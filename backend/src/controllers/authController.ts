import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { generateOTP } from '../utils/otpGenerator';
import { sendOTPEmail } from '../services/emailService';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const register = async (req: Request, res: Response) => {
  const { full_name, email, phone, password } = req.body;

  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.execute(
      'INSERT INTO users (full_name, email, phone, password_hash, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, password_hash, otp, otp_expires_at]
    );

    await sendOTPEmail(email, otp);

    res.status(201).json({ message: 'User registered. Please verify OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_image: user.profile_image
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT id, otp, otp_expires_at FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await pool.execute(
      'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE id = ?',
      [user.id]
    );

    // Give trial subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 15);

    await pool.execute(
      'INSERT INTO subscriptions (user_id, plan, start_date, end_date) VALUES (?, "trial", ?, ?)',
      [user.id, startDate, endDate]
    );

    res.json({ message: 'Email verified successfully. You now have a 15-day free trial.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?',
      [otp, otp_expires_at, email]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP resent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const otp = generateOTP();
        const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const [result] = await pool.execute<ResultSetHeader>(
            'UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?',
            [otp, otp_expires_at, email]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        await sendOTPEmail(email, otp);
        res.json({ message: 'Reset OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    try {
        const [users] = await pool.execute<RowDataPacket[]>(
            'SELECT id, otp, otp_expires_at FROM users WHERE email = ?',
            [email]
        );
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = users[0];
        if (user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const password_hash = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE users SET password_hash = ?, otp = NULL, otp_expires_at = NULL WHERE id = ?',
            [password_hash, user.id]
        );
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
