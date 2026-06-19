import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as linkController from '../controllers/links.controller.js';

const router = Router();

router.post("/", authMiddleware, linkController.createLink)

router.get("/:username", linkController.getLinksByUsername)

export default router;