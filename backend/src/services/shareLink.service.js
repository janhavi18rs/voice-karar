import Agreement from '../models/Agreement.js';
import ApiError from '../utils/ApiError.js';

/**
 * Retrieves the agreement details for public review via a shareable link.
 * Authentication is NOT required for this route (anyone with the link can review it).
 *
 * Security/UX check:
 * - We populate the creator's basic details (name, email) for context.
 * - We exclude heavy/private fields (like aiExtractedData) to reduce bandwidth and secure raw data.
 * - Throws a 404 if the link is not found or has been deleted.
 *
 * @param {string} shareToken - the unique 24-character hexadecimal share token
 * @returns {Promise<Agreement>}
 */
export const getAgreementByShareId = async (shareToken) => {
  if (!shareToken) {
    throw new ApiError(400, 'Share token is required');
  }

  const agreement = await Agreement.findOne({ shareToken })
    .populate('creator', 'name email')
    .select('-aiExtractedData');

  if (!agreement) {
    throw new ApiError(404, 'Shared agreement link is invalid or has expired');
  }

  return agreement;
};

export default {
  getAgreementByShareId,
};
