import { Router } from 'express';
import { submitPayment, getUserPayments } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.post('/submit', upload.single('proof'), submitPayment);
router.get('/my-payments', getUserPayments);

export default router;
