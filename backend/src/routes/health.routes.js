import express from 'express';
import healthController from '../controllers/health.controller.js';

const router = express.Router();

router.get('/', healthController.checkHealth);

export default router;
