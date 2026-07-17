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
