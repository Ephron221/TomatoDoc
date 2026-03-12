import { Router } from 'express';
  import { 
    getAdminStats, 
    getAllPayments, 
    approvePayment, 
    rejectPayment, 
    deletePayment,
    getAllUsers, 
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus, 
    getAllExperts,
    createExpert, 
    deleteExpert, 
    getAdminNotifications, 
    markNotificationRead,
    updateAdminProfile,
    changeAdminPassword,
    getAllContacts
  } from '../controllers/adminController';
  import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';
  import { upload } from '../middleware/uploadMiddleware';

  const router = Router();

  router.use(authenticate, authorizeAdmin);

  router.get('/stats', getAdminStats);
  router.get('/payments', getAllPayments);
  router.post('/payments/approve/:id', approvePayment);
  router.post('/payments/reject/:id', rejectPayment);
  router.delete('/payments/:id', deletePayment);

  router.get('/users', getAllUsers);
  router.post('/users', createUser);
  router.put('/users/:id', updateUser);
  router.delete('/users/:id', deleteUser);
  router.post('/users/toggle-status/:id', toggleUserStatus);

  router.get('/experts', getAllExperts);
  router.post('/experts', upload.single('photo'), createExpert);
  router.delete('/experts/:id', deleteExpert);

  router.get('/contacts', getAllContacts);

  router.get('/notifications', getAdminNotifications);
  router.post('/notifications/mark-read/:id', markNotificationRead);

  router.put('/profile', upload.single('profile_image'), updateAdminProfile);
  router.post('/change-password', changeAdminPassword);

  export default router;
  