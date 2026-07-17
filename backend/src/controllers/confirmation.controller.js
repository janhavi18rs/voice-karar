import * as confirmationService from '../services/confirmation.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * POST /api/v1/confirmations/accept
 *
 * Public endpoint for counterparty to sign and accept the agreement.
 */
export const accept = async (req, res, next) => {
  try {
    const { agreementId, email, signatureText } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const result = await confirmationService.confirmAgreement({
      agreementId,
      email,
      signatureText,
      ipAddress,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, result, 'Agreement accepted and confirmed successfully')
      );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/confirmations/request-changes
 *
 * Public endpoint for counterparty to request changes/revisions on the agreement.
 */
export const reject = async (req, res, next) => {
  try {
    const { agreementId, email, note } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const agreement = await confirmationService.requestChanges({
      agreementId,
      email,
      note,
      ipAddress,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { agreement }, 'Changes requested successfully')
      );
  } catch (err) {
    next(err);
  }
};

export default {
  accept,
  reject,
};
