import express from 'express';
import authController from '../controllers/auth.controller.js';
import validationMiddleware from '../middleware/validation.middleware.js';
import authValidation from '../validations/auth.validation.js';

const router = express.Router();

router.post(
  '/register',
  validationMiddleware(authValidation.registerSchema),
  authController.register
);

router.post(
  '/login',
  validationMiddleware(authValidation.loginSchema),
  authController.login
);

export default router;
