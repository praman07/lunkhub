import { Router } from 'express';
import authRoutes from './auth.routes.js';
import linkRoutes from './link.routes.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getLinkAnalyticsByUsername } from '../controllers/links.controller.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);
router.get('/link/:username/analytics', authMiddleware, getLinkAnalyticsByUsername);

export default router;