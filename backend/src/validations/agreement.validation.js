/**
 * src/validations/agreement.validation.js
 *
 * Request body validation schemas for agreement endpoints.
 * Used by validation.middleware.js to reject malformed payloads
 * before they reach the service layer.
 *
 * Design rule: validate what the CLIENT sends, not what the DB stores.
 * The AI module populates agreedTerms — we only validate its shape.
 */

// ─── Create Agreement ─────────────────────────────────────────────────────────

/**
 * POST /api/v1/agreements
 *
 * The frontend sends this after the AI has finished extracting details.
 * Required: title, rawTranscript, agreedTerms (with at least product + price)
 * Optional: counterParty details
 */
export const createAgreementSchema = {
  body: {
    title: {
      required: true,
      type: 'string',
      min: 3,
      message: 'Agreement title must be at least 3 characters',
    },
    rawTranscript: {
      required: true,
      type: 'string',
      min: 10,
      message: 'Raw transcript must be at least 10 characters',
    },
    agreedTerms: {
      required: true,
      type: 'object',
      message: 'agreedTerms object is required (AI extracted data)',
    },
  },
};

// ─── Update Agreement Terms ───────────────────────────────────────────────────

/**
 * PATCH /api/v1/agreements/:id
 *
 * Creator can update the title or agreed terms before the
 * counter-party has responded.
 * All fields are optional — send only what you want to change.
 */
export const updateAgreementSchema = {
  body: {
    title: {
      required: false,
      type: 'string',
      min: 3,
    },
    agreedTerms: {
      required: false,
      type: 'object',
    },
    counterParty: {
      required: false,
      type: 'object',
    },
    aiStructuredData: {
      required: false,
      type: 'object',
    },
  },
};

// ─── Cancel Agreement ─────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/agreements/:id/cancel
 *
 * Creator cancels the agreement. Optional reason note.
 */
export const cancelAgreementSchema = {
  body: {
    note: {
      required: false,
      type: 'string',
    },
  },
};

export default {
  createAgreementSchema,
  updateAgreementSchema,
  cancelAgreementSchema,
};
