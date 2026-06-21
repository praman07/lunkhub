import { Router } from 'express';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../controllers/auth.controller.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { loginValidation, registerValidation } from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', logoutUser);

export default router;