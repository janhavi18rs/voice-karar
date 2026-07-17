import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const router = express.Router();

/**
 * PRIVATE ROUTES (JWT required)
 * Base route: /api/v1/dashboard
 */
router.use(protect);

router.get('/', getDashboardStats);

export default router;
