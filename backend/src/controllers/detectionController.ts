import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { predictDisease } from '../services/aiService';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const detectDisease = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { sessionId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    // 1. Get prediction from AI service
    const prediction = await predictDisease(file.path);

    // 2. Save user message with image
    const [msgResult] = await pool.execute<ResultSetHeader>(
      'INSERT INTO chat_messages (session_id, sender, message_type, image_path) VALUES (?, "user", "image", ?)',
      [sessionId, file.path]
    );

    const messageId = msgResult.insertId;

    // 3. Save detection results
    await pool.execute(
      'INSERT INTO detection_results (message_id, disease_name, severity, diagnosis, possible_causes, prevention_tips, confidence_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        messageId,
        prediction.disease,
        prediction.severity,
        prediction.diagnosis,
        prediction.causes,
        prediction.prevention,
        prediction.confidence,
      ]
    );

    // 4. Update image usage for user
    await pool.execute(
      'UPDATE subscriptions SET images_used_today = images_used_today + 1 WHERE user_id = ? AND is_active = TRUE',
      [userId ?? null]
    );

    // 5. Generate AI response message (structured)
    const aiContent = `Detected: ${prediction.disease}. Severity: ${prediction.severity}. Diagnosis: ${prediction.diagnosis}`;
    const [aiMsgResult] = await pool.execute<ResultSetHeader>(
      'INSERT INTO chat_messages (session_id, sender, message_type, content) VALUES (?, "ai", "text", ?)',
      [sessionId, aiContent]
    );

    res.json({
        messageId,
        aiMessageId: aiMsgResult.insertId,
        prediction,
        imagePath: file.path
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Detection failed' });
  }
};
