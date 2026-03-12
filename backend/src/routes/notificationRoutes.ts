import { Router } from 'express';
import { getMyNotifications, markRead } from '../controllers/notificationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/my-notifications', getMyNotifications);
router.post('/mark-read/:id', markRead);

export default router;
