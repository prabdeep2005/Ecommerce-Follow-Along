import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    getCurrentUser,
    changePassword,
    becomeSeller
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes - no authentication needed
router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);

// Protected routes - require authentication
router.use(verifyJWT);

// User profile routes
router.get('/me', getCurrentUser);
router.patch('/update-profile', upload.single('avatar'), updateUserProfile);
router.patch('/change-password', changePassword);
router.patch('/become-seller', becomeSeller);

// Account management routes
router.post('/logout', logoutUser);

export default router;