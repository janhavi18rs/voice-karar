/**
 * src/routes/agreement.routes.js
 *
 * Agreement endpoint definitions.
 *
 * Base path (mounted in app.js): /api/v1/agreements
 *
 * Route map:
 *
 *  PUBLIC  (no auth required):
 *    GET  /share/:token        → fetch agreement by share token (for counter-party)
 *
 *  PRIVATE (JWT required):
 *    POST   /                  → create agreement
 *    GET    /                  → list my agreements (dashboard)
 *    GET    /:id               → get one agreement (detail)
 *    PATCH  /:id               → update title / terms
 *    PATCH  /:id/cancel        → cancel agreement
 *    DELETE /:id               → delete (non-confirmed only)
 */

import express from 'express';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validation.middleware.js';
import {
  create,
  getMine,
  getById,
  getByShareId,
  update,
  cancel,
  remove,
} from '../controllers/agreement.controller.js';
import agreementValidation from '../validations/agreement.validation.js';

// NOTE: the share route is in confirmation.routes.js / shareLink.routes.js
// to keep sharing concerns separate. It's referenced in app.js.

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/share/:shareToken', getByShareId);

// ── Private — apply auth middleware to ALL routes below this line ─────────────
router.use(protect);

// Create
router.post(
  '/',
  validate(agreementValidation.createAgreementSchema),
  create
);

// List (my agreements, with optional status filter + pagination)
router.get('/', getMine);

// Detail (single agreement)
router.get('/:id', getById);

// Update terms
router.patch(
  '/:id',
  validate(agreementValidation.updateAgreementSchema),
  update
);

// Cancel
router.patch(
  '/:id/cancel',
  validate(agreementValidation.cancelAgreementSchema),
  cancel
);

// Delete
router.delete('/:id', remove);

export default router;
