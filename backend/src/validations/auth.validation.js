/**
 * Validation schemas for authentication routes.
 * These can be mapped directly to validation middlewares.
 */

export const registerSchema = {
  body: {
    name: {
      required: true,
      type: 'string',
      min: 2,
    },
    businessName: {
      required: true,
      type: 'string',
      min: 2,
    },
    mobile: {
      required: true,
      type: 'string',
      regex: /^\+?[0-9]{10,12}$/,
      message: 'mobile must be a valid phone number',
    },
    email: {
      required: true,
      type: 'string',
      regex: /^\S+@\S+\.\S+$/,
    },
    password: {
      required: true,
      type: 'string',
      min: 6,
    },
    businessType: {
      required: false,
      type: 'string',
    },
    businessCategory: {
      required: false,
      type: 'string',
    },
    preferredLanguage: {
      required: false,
      type: 'string',
    },
  },
};

export const loginSchema = {
  body: {
    email: {
      required: true,
      type: 'string',
    },
    password: {
      required: true,
      type: 'string',
    },
  },
};

export default {
  registerSchema,
  loginSchema,
};
