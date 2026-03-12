import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT id, full_name, email, phone, role, profile_image, is_verified, created_at FROM users WHERE id = ?', 
      [userId]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { full_name, phone } = req.body;
  const userId = (req as any).user?.id;
  const file = req.file;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let updateFields = ['full_name = ?', 'phone = ?'];
    let params: any[] = [full_name, phone];

    if (file) {
      // Delete old profile image if exists
      const [users] = await pool.execute<RowDataPacket[]>('SELECT profile_image FROM users WHERE id = ?', [userId]);
      if (users.length > 0 && users[0].profile_image) {
        const oldPath = path.resolve(users[0].profile_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      
      const filePath = file.path.replace(/\\/g, '/');
      updateFields.push('profile_image = ?');
      params.push(filePath);
    }

    params.push(userId);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    await pool.execute(query, params);

    // Fetch updated user
    const [updatedUser] = await pool.execute<RowDataPacket[]>(
      'SELECT id, full_name, email, phone, role, profile_image FROM users WHERE id = ?', 
      [userId]
    );

    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser[0] 
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user?.id;

  try {
    const [users] = await pool.execute<RowDataPacket[]>('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
