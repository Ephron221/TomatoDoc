import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getExperts = async (req: Request, res: Response) => {
  try {
    const [experts] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM experts'
    );
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getExpertById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [experts] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM experts WHERE id = ?',
      [id]
    );
    if (experts.length === 0) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.json(experts[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
