import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getAIChatResponse } from '../services/aiService';

export const createChatSession = async (req: AuthRequest, res: Response) => {
  const { title, language } = req.body;
  const userId = req.user?.id;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO chat_sessions (user_id, title, language) VALUES (?, ?, ?)',
      [userId ?? null, title || 'New Chat', language || 'en']
    );

    res.status(201).json({ id: result.insertId, title, language });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChatSessions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const [sessions] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC',
      [userId ?? null]
    );

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteChatSession = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        await pool.execute('DELETE FROM chat_messages WHERE session_id = ?', [id]);
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
            [id, userId ?? null]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Session not found' });
        res.json({ message: 'Session deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;

  try {
    const [messages] = await pool.execute<RowDataPacket[]>(
      'SELECT cm.*, dr.disease_name, dr.severity, dr.diagnosis, dr.possible_causes, dr.prevention_tips, dr.confidence_score FROM chat_messages cm LEFT JOIN detection_results dr ON cm.id = dr.message_id WHERE cm.session_id = ? ORDER BY cm.created_at ASC',
      [sessionId]
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { sessionId, message, message_type } = req.body;

  try {
    // 1. Get session info to know language
    const [sessions] = await pool.execute<RowDataPacket[]>(
        'SELECT language FROM chat_sessions WHERE id = ?',
        [sessionId]
    );
    const language = (sessions as RowDataPacket[])[0]?.language || 'en';

    // 2. Check if there was a recent detection in this session for context
    const [recentDetections] = await pool.execute<RowDataPacket[]>(
        'SELECT dr.* FROM detection_results dr JOIN chat_messages cm ON dr.message_id = cm.id WHERE cm.session_id = ? ORDER BY cm.created_at DESC LIMIT 1',
        [sessionId]
    );
    const diseaseInfo = (recentDetections as RowDataPacket[])[0] || null;

    // 3. Save user message
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO chat_messages (session_id, sender, message_type, content) VALUES (?, "user", ?, ?)',
      [sessionId, message_type || 'text', message]
    );

    // 4. Call AI service for response
    const aiResponse = await getAIChatResponse(message, language, diseaseInfo);
    
    // 5. Save AI response
    const [aiResult] = await pool.execute<ResultSetHeader>(
      'INSERT INTO chat_messages (session_id, sender, message_type, content) VALUES (?, "ai", "text", ?)',
      [sessionId, aiResponse]
    );

    res.status(201).json({
      userMessageId: result.insertId,
      aiMessageId: aiResult.insertId,
      aiResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
