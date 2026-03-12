import { Router } from 'express';
import { createChatSession, getChatSessions, getChatMessages, sendMessage, deleteChatSession } from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/sessions', createChatSession);
router.get('/sessions', getChatSessions);
router.delete('/sessions/:id', deleteChatSession);
router.get('/sessions/:sessionId/messages', getChatMessages);
router.post('/messages', sendMessage);

export default router;
