import { Router } from 'express';
import { getMySubscription, getSubscriptionHistory } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/my-subscription', getMySubscription);
router.get('/history', getSubscriptionHistory);

export default router;
