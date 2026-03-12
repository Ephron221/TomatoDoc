import { Router } from 'express';
import { updateProfile, changePassword, getProfile } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', upload.single('profile_image'), updateProfile);
router.post('/change-password', changePassword);

export default router;
