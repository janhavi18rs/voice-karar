import ApiError from '../utils/ApiError.js';

/**
 * src/middleware/validation.middleware.js
 *
 * Generic request body validator.
 * Accepts a schema descriptor and returns an Express middleware function.
 *
 * Supported rule types: 'string' | 'number' | 'boolean' | 'array' | 'object'
 * Supported rules: required, type, min (string length / number value), enum, regex
 *
 * Usage:
 *   router.post('/', validate(mySchema), myController);
 */
const validate = (schema) => (req, res, next) => {
  if (!schema?.body) return next();

  const errors = [];

  for (const [field, rules] of Object.entries(schema.body)) {
    const val = req.body?.[field];
    const isMissing = val === undefined || val === null || val === '';

    // ── required check ──────────────────────────────────────────────────────
    if (rules.required && isMissing) {
      errors.push({
        field,
        message: rules.message || `${field} is required`,
      });
      continue; // skip further checks for this field
    }

    // If not required and not present, skip all other checks
    if (isMissing) continue;

    // ── type check ───────────────────────────────────────────────────────────
    const typeOf = typeof val;

    if (rules.type === 'array') {
      if (!Array.isArray(val)) {
        errors.push({ field, message: `${field} must be an array` });
        continue;
      }
    } else if (rules.type === 'object') {
      if (typeOf !== 'object' || Array.isArray(val)) {
        errors.push({ field, message: `${field} must be an object` });
        continue;
      }
    } else if (rules.type && typeOf !== rules.type) {
      errors.push({ field, message: `${field} must be a ${rules.type}` });
      continue;
    }

    // ── min check (string length or number value) ────────────────────────────
    if (rules.min !== undefined) {
      if (rules.type === 'string' && val.length < rules.min) {
        errors.push({
          field,
          message: rules.message || `${field} must be at least ${rules.min} characters`,
        });
      }
      if (rules.type === 'number' && val < rules.min) {
        errors.push({
          field,
          message: `${field} must be at least ${rules.min}`,
        });
      }
    }

    // ── enum check ───────────────────────────────────────────────────────────
    if (rules.enum && !rules.enum.includes(val)) {
      errors.push({
        field,
        message: `${field} must be one of: ${rules.enum.join(', ')}`,
      });
    }

    // ── regex check ──────────────────────────────────────────────────────────
    if (rules.regex && !rules.regex.test(String(val))) {
      errors.push({
        field,
        message: rules.message || `${field} has an invalid format`,
      });
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  return next();
};

export default validate;
export { validate };
