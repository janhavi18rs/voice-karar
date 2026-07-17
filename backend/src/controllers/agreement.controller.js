/**
 * src/controllers/agreement.controller.js
 *
 * Thin HTTP layer — handles req/res only.
 * All business logic lives in agreement.service.js.
 *
 * Route → Controller → Service → Model
 */

import * as agreementService from '../services/agreement.service.js';
import shareLinkService from '../services/shareLink.service.js';
import ApiResponse from '../utils/ApiResponse.js';

// ─── POST /api/v1/agreements ──────────────────────────────────────────────────

/**
 * Create a new agreement from AI-extracted data.
 * Auth: required (creator must be logged in)
 */
export const create = async (req, res, next) => {
  try {
    const agreement = await agreementService.createAgreement(
      req.user._id,
      req.body
    );

    return res
      .status(201)
      .json(new ApiResponse(201, { agreement }, 'Agreement created successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/agreements ───────────────────────────────────────────────────

/**
 * Get all agreements for the logged-in user (dashboard list).
 * Auth: required
 *
 * Query params:
 *  - status: filter by 'pending' | 'confirmed' | 'needs_changes' | 'cancelled'
 *  - page:   page number (default: 1)
 *  - limit:  items per page (default: 10, max: 50)
 */
export const getMine = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;

    const result = await agreementService.getAgreementsByUser(req.user._id, {
      status,
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 10, 50), // hard cap at 50
    });

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Agreements retrieved successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/agreements/:id ───────────────────────────────────────────────

/**
 * Get a single agreement (detail view).
 * Auth: required — only the creator can access this.
 */
export const getById = async (req, res, next) => {
  try {
    const agreement = await agreementService.getAgreementById(
      req.params.id,
      req.user._id
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { agreement }, 'Agreement retrieved successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single agreement (detail view).
 * Auth: required — only the creator can access this.
 */
export const getByShareId = async (req, res, next) => {
  try {
    const agreement = await shareLinkService.getAgreementByShareId(req.params.shareToken);
    return res
      .status(200)
      .json(new ApiResponse(200, { agreement }, 'Shared agreement retrieved successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/v1/agreements/:id ────────────────────────────────────────────

/**
 * Update agreement title and/or terms.
 * Auth: required — only creator, only while status is 'pending' or 'needs_changes'.
 */
export const update = async (req, res, next) => {
  try {
    const agreement = await agreementService.updateAgreement(
      req.params.id,
      req.user._id,
      req.body
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { agreement }, 'Agreement updated successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/v1/agreements/:id/cancel ─────────────────────────────────────

/**
 * Cancel a pending agreement.
 * Auth: required — only the creator.
 */
export const cancel = async (req, res, next) => {
  try {
    const agreement = await agreementService.cancelAgreement(
      req.params.id,
      req.user._id,
      req.body.note
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { agreement }, 'Agreement cancelled successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/v1/agreements/:id ───────────────────────────────────────────

/**
 * Permanently delete a non-confirmed agreement.
 * Auth: required — only the creator.
 */
export const remove = async (req, res, next) => {
  try {
    await agreementService.deleteAgreement(req.params.id, req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Agreement deleted successfully'));
  } catch (err) {
    next(err);
  }
};

export default { create, getMine, getById, getByShareId, update, cancel, remove };
