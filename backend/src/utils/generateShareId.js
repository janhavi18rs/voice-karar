import crypto from 'crypto';

/**
 * Generates a random, secure, URL-safe string token to identify public share links.
 * @param {number} length length of random bytes
 * @returns {string} share ID
 */
export const generateShareId = (length = 12) => {
  return crypto.randomBytes(length).toString('hex');
};

export default generateShareId;
