import express from 'express';
import { accept, reject } from '../controllers/confirmation.controller.js';
import validate from '../middleware/validation.middleware.js';
import validationSchema from '../validations/confirmation.validation.js';

const router = express.Router();

/**
 * PUBLIC ROUTES (no authorization header required)
 * These endpoints are accessed by the counterparty via the public shareable link.
 */

// Accept / Confirm terms
router.post(
  '/accept',
  validate(validationSchema.confirmAgreementSchema),
  accept
);

// Request changes / revisions
router.post(
  '/request-changes',
  validate(validationSchema.requestChangesSchema),
  reject
);

export default router;
