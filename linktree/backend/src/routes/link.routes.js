import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as linkController from '../controllers/links.controller.js';

const router = Router();

router.post("/", authMiddleware, linkController.createLink)

/**
 * GET /api/links/:username
 * Get all links for a specific user by username
 * Public route
 */
router.get("/:username", linkController.getLinksByUsername)


router.patch("/:linkId/click", linkController.incrementLinkClick)

export default router;