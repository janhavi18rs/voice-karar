/**
 * src/services/agreement.service.js
 *
 * Business logic for agreement lifecycle management.
 *
 * Architecture rule:
 *  - This layer knows about Models and utils — it does NOT know about
 *    Express (req, res, next). Keep it framework-agnostic.
 *  - All DB errors bubble up as-is; ApiErrors are thrown for business logic failures.
 */

import Agreement from '../models/Agreement.js';
import { generateShareId } from '../utils/generateShareId.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates that the agreement belongs to the requesting user.
 * Prevents users from modifying another user's agreements.
 */
const assertOwnership = (agreement, userId) => {
  if (agreement.creator.toString() !== userId.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this agreement');
  }
};

/**
 * Validates that the agreement is still modifiable.
 * Once confirmed or cancelled, edits are not allowed.
 */
const assertModifiable = (agreement) => {
  if (agreement.status === 'confirmed') {
    throw new ApiError(400, 'This agreement has already been confirmed and cannot be modified');
  }
  if (agreement.status === 'cancelled') {
    throw new ApiError(400, 'This agreement has been cancelled');
  }
};

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Creates a new agreement from AI-extracted data.
 *
 * The frontend sends:
 *  - title: string
 *  - rawTranscript: string (original voice-to-text output)
 *  - agreedTerms: object (structured data from Gemini AI)
 *  - counterParty: object (optional — name, email, phone, role)
 *  - aiExtractedData: object (optional — full raw AI response for traceability)
 *
 * @param {string} userId - authenticated creator's MongoDB _id
 * @param {object} payload - validated request body
 * @returns {Promise<Agreement>}
 */
export const createAgreement = async (userId, payload) => {
  const {
    title,
    rawTranscript,
    agreedTerms,
    counterParty,
    aiExtractedData,
  } = payload;

  // Generate a unique share token (24 hex chars = 96 bits of entropy)
  const shareToken = generateShareId(12);

  const agreement = await Agreement.create({
    title,
    creator: userId,
    rawTranscript: rawTranscript || '',
    agreedTerms,
    counterParty: counterParty || {},
    aiExtractedData: aiExtractedData || null,
    shareToken,
    status: 'pending',
    history: [
      {
        action: 'created',
        performedBy: userId.toString(),
        note: 'Agreement created from voice summary',
      },
    ],
  });

  return agreement;
};

// ─── Read — My Agreements (Dashboard) ────────────────────────────────────────

/**
 * Fetches all agreements created by a user, newest first.
 * Supports optional filtering by status and pagination.
 *
 * @param {string} userId
 * @param {object} options - { status?, page?, limit? }
 * @returns {Promise<{ agreements, total, page, totalPages }>}
 */
export const getAgreementsByUser = async (userId, options = {}) => {
  const { status, page = 1, limit = 10 } = options;

  const filter = { creator: userId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [agreements, total] = await Promise.all([
    Agreement.find(filter)
      .sort({ createdAt: -1 }) // newest first — uses compound index
      .skip(skip)
      .limit(limit)
      .select('-aiExtractedData -rawTranscript'), // exclude heavy fields from list view
    Agreement.countDocuments(filter),
  ]);

  return {
    agreements,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// ─── Read — Single Agreement (Detail View) ────────────────────────────────────

/**
 * Fetches a single agreement by its MongoDB _id.
 * Only the creator can access this route (enforced here + in controller).
 *
 * @param {string} agreementId
 * @param {string} userId - used to assert ownership
 * @returns {Promise<Agreement>}
 */
export const getAgreementById = async (agreementId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  const agreement = await Agreement.findById(agreementId);

  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  assertOwnership(agreement, userId);

  return agreement;
};

// ─── Update — Edit Terms ──────────────────────────────────────────────────────

/**
 * Updates the title or agreed terms of a pending agreement.
 * Only the creator can update; confirmed/cancelled agreements are locked.
 *
 * @param {string} agreementId
 * @param {string} userId
 * @param {object} updates - { title?, agreedTerms? }
 * @returns {Promise<Agreement>}
 */
export const updateAgreement = async (agreementId, userId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  const agreement = await Agreement.findById(agreementId);

  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  assertOwnership(agreement, userId);
  assertModifiable(agreement);

  // Apply allowed field updates
  if (updates.title) agreement.title = updates.title;

  if (updates.agreedTerms) {
    // Merge new terms with existing ones (partial update support)
    agreement.agreedTerms = {
      ...agreement.agreedTerms.toObject(),
      ...updates.agreedTerms,
    };
  }

  // Append audit trail entry
  agreement.history.push({
    action: 'updated',
    performedBy: userId.toString(),
    note: updates.note || 'Agreement terms updated by creator',
  });

  await agreement.save();
  return agreement;
};

// ─── Cancel ───────────────────────────────────────────────────────────────────

/**
 * Cancels a pending agreement.
 * Only the creator can cancel; cannot cancel a confirmed agreement.
 *
 * @param {string} agreementId
 * @param {string} userId
 * @param {string} note - optional reason for cancellation
 * @returns {Promise<Agreement>}
 */
export const cancelAgreement = async (agreementId, userId, note = '') => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  const agreement = await Agreement.findById(agreementId);

  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  assertOwnership(agreement, userId);

  if (agreement.status === 'confirmed') {
    throw new ApiError(400, 'A confirmed agreement cannot be cancelled');
  }

  if (agreement.status === 'cancelled') {
    throw new ApiError(400, 'Agreement is already cancelled');
  }

  agreement.status = 'cancelled';

  agreement.history.push({
    action: 'cancelled',
    performedBy: userId.toString(),
    note: note || 'Agreement cancelled by creator',
  });

  await agreement.save();
  return agreement;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Hard-deletes an agreement from the database.
 * Only allowed for cancelled agreements — confirmed agreements
 * are permanent records and cannot be deleted.
 *
 * @param {string} agreementId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const deleteAgreement = async (agreementId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  const agreement = await Agreement.findById(agreementId);

  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  assertOwnership(agreement, userId);

  if (agreement.status === 'confirmed') {
    throw new ApiError(
      403,
      'Confirmed agreements are permanent records and cannot be deleted'
    );
  }

  await Agreement.deleteOne({ _id: agreement._id });
};

export default {
  createAgreement,
  getAgreementsByUser,
  getAgreementById,
  updateAgreement,
  cancelAgreement,
  deleteAgreement,
};
