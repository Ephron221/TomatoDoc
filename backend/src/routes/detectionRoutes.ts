import { Router } from 'express';
import { detectDisease } from '../controllers/detectionController';
import { authenticate } from '../middleware/authMiddleware';
import { checkSubscription } from '../middleware/subscriptionMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/detect', authenticate, checkSubscription, upload.single('image'), detectDisease);

export default router;
