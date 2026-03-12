import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const submitContactMessage = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    await pool.execute<ResultSetHeader>(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || 'No Subject', message]
    );

    // Also notify admin
    await pool.execute(
      'INSERT INTO notifications (target, title, message) VALUES ("admin", "New Contact Message", ?)',
      [`You have a new message from ${name} (${email}). Phone: ${phone || 'N/A'}`]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
