import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [usersCount] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM users WHERE role = "farmer"');
    const [pendingPayments] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM payments WHERE status = "pending"');
    const [activeSubscriptions] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM subscriptions WHERE is_active = TRUE');
    const [totalDetections] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM detection_results');
    
    const [revenue] = await pool.execute<RowDataPacket[]>('SELECT SUM(amount) as total FROM payments WHERE status = "approved"');
    const [pendingAmount] = await pool.execute<RowDataPacket[]>('SELECT SUM(amount) as total FROM payments WHERE status = "pending"');

    res.json({
      totalUsers: usersCount[0].count,
      pendingPayments: pendingPayments[0].count,
      activeSubscriptions: activeSubscriptions[0].count,
      totalDetections: totalDetections[0].count,
      totalRevenue: revenue[0].total || 0,
      pendingRevenue: pendingAmount[0].total || 0
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const [payments] = await pool.execute<RowDataPacket[]>('SELECT * FROM payments ORDER BY submitted_at DESC');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [payments] = await pool.execute<RowDataPacket[]>('SELECT * FROM payments WHERE id = ?', [id]);
    if (payments.length === 0) return res.status(404).json({ message: 'Payment not found' });
    const payment = payments[0];

    await pool.execute('UPDATE payments SET status = "approved", approved_at = NOW() WHERE id = ?', [id]);

    const startDate = new Date();
    const endDate = new Date();
    const plan = payment.plan;

    if (plan === 'daily') endDate.setDate(startDate.getDate() + 1);
    else if (plan === 'weekly') endDate.setDate(startDate.getDate() + 7);
    else if (plan === 'biweekly') endDate.setDate(startDate.getDate() + 14);
    else if (plan === 'monthly') endDate.setDate(startDate.getDate() + 30);

    await pool.execute('INSERT INTO subscriptions (user_id, plan, start_date, end_date) VALUES (?, ?, ?, ?)', [payment.user_id, plan, startDate, endDate]);

    await pool.execute('INSERT INTO notifications (target, user_id, title, message) VALUES ("user", ?, "Payment Approved", ?)', 
      [payment.user_id, `Your ${plan} plan is now active until ${endDate.toDateString()}.`]);

    res.json({ message: 'Payment approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [payments] = await pool.execute<RowDataPacket[]>('SELECT user_id FROM payments WHERE id = ?', [id]);
    if (payments.length === 0) return res.status(404).json({ message: 'Payment not found' });
    
    await pool.execute('UPDATE payments SET status = "rejected" WHERE id = ?', [id]);
    await pool.execute('INSERT INTO notifications (target, user_id, title, message) VALUES ("user", ?, "Payment Rejected", ?)', 
        [payments[0].user_id, "Your payment proof was rejected. Please contact support."]);
    
    res.json({ message: 'Payment rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [payments] = await pool.execute<RowDataPacket[]>('SELECT proof_file FROM payments WHERE id = ?', [id]);
    if (payments.length === 0) return res.status(404).json({ message: 'Payment not found' });

    const proofFile = payments[0].proof_file;

    if (proofFile) {
      const filePath = path.join(__dirname, '../../', proofFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.execute('DELETE FROM payments WHERE id = ?', [id]);
    res.json({ message: 'Payment proof deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.execute<RowDataPacket[]>('SELECT id, full_name, email, phone, is_verified, role, created_at, profile_image FROM users WHERE role = "farmer" ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
  const { full_name, email, phone, password, role } = req.body;
  try {
    const [existing] = await pool.execute<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (full_name, email, phone, password_hash, role, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)',
      [full_name, email, phone, hash, role || 'farmer']
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { full_name, email, phone, role } = req.body;
  try {
    await pool.execute(
      'UPDATE users SET full_name = ?, email = ?, phone = ?, role = ? WHERE id = ?',
      [full_name, email, phone, role, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [users] = await pool.execute<RowDataPacket[]>('SELECT is_verified FROM users WHERE id = ?', [id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        await pool.execute('UPDATE users SET is_verified = ? WHERE id = ?', [!users[0].is_verified, id]);
        res.json({ message: 'User status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAdminProfile = async (req: Request, res: Response) => {
  const { full_name, phone } = req.body;
  const userId = (req as any).user?.id;
  const file = req.file;

  console.log('Update Request Body:', req.body);
  console.log('Update User ID:', userId);

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let updateQuery = 'UPDATE users SET full_name = ?, phone = ?';
    let params: any[] = [full_name, phone];

    if (file) {
      // Safely check for old image
      try {
        const [users] = await pool.execute<RowDataPacket[]>('SELECT profile_image FROM users WHERE id = ?', [userId]);
        if (users.length > 0 && users[0].profile_image) {
          const oldPath = path.join(__dirname, '../../', users[0].profile_image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.warn('Profile image column might be missing or other error:', err);
      }
      
      const filePath = file.path.replace(/\\/g, '/');
      updateQuery += ', profile_image = ?';
      params.push(filePath);
    }

    updateQuery += ' WHERE id = ?';
    params.push(userId);

    const [result] = await pool.execute<ResultSetHeader>(updateQuery, params);
    console.log('Update Result:', result);

    // Fetch refreshed user data
    const [updatedUser] = await pool.execute<RowDataPacket[]>(
      'SELECT id, full_name, email, phone, role, profile_image FROM users WHERE id = ?', 
      [userId]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser[0] 
    });
  } catch (error: any) {
    console.error('CRITICAL: Update Profile Error:', error);
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ message: 'Database column profile_image is missing. Run the ALTER TABLE command.' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user.id;
  try {
    const [users] = await pool.execute<RowDataPacket[]>('SELECT password_hash FROM users WHERE id = ?', [userId]);
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

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const [contacts] = await pool.execute<RowDataPacket[]>('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllExperts = async (req: Request, res: Response) => {
    try {
        const [experts] = await pool.execute<RowDataPacket[]>('SELECT * FROM experts ORDER BY id DESC');
        res.json(experts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createExpert = async (req: Request, res: Response) => {
    const { full_name, description, email, whatsapp, phone, specialization } = req.body;
    const file = req.file;
    try {
        await pool.execute(
            'INSERT INTO experts (full_name, photo, description, email, whatsapp, phone, specialization) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, file?.path || '', description, email, whatsapp, phone, specialization]
        );
        res.status(201).json({ message: 'Expert added' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteExpert = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM experts WHERE id = ?', [id]);
        res.json({ message: 'Expert deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAdminNotifications = async (req: Request, res: Response) => {
    try {
        const [notifs] = await pool.execute<RowDataPacket[]>('SELECT * FROM notifications WHERE target = "admin" ORDER BY created_at DESC');
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const markNotificationRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
