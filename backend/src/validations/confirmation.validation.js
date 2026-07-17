/**
 * src/validations/confirmation.validation.js
 *
 * Validation schemas for confirmation module endpoints.
 */

export const confirmAgreementSchema = {
  body: {
    agreementId: {
      required: true,
      type: 'string',
      message: 'Agreement ID is required',
    },
    email: {
      required: true,
      type: 'string',
      regex: /^\S+@\S+\.\S+$/,
      message: 'A valid email is required to confirm identity',
    },
    signatureText: {
      required: true,
      type: 'string',
      min: 2,
      message: 'Signature representation is required (min 2 characters)',
    },
  },
};

export const requestChangesSchema = {
  body: {
    agreementId: {
      required: true,
      type: 'string',
      message: 'Agreement ID is required',
    },
    email: {
      required: true,
      type: 'string',
      regex: /^\S+@\S+\.\S+$/,
      message: 'A valid email is required to request changes',
    },
    note: {
      required: true,
      type: 'string',
      min: 5,
      message: 'Please provide feedback explaining the changes requested (min 5 characters)',
    },
  },
};

export default {
  confirmAgreementSchema,
  requestChangesSchema,
};
