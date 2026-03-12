import { Router } from 'express';
import { getExperts, getExpertById } from '../controllers/expertController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getExperts);
router.get('/:id', getExpertById);

export default router;
