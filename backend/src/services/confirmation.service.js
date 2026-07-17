import Confirmation from '../models/Confirmation.js';
import Agreement from '../models/Agreement.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Confirms/Accepts an agreement by creating a Confirmation record
 * and updating the agreement status to 'confirmed'.
 *
 * Validation checks:
 * - Checks if the agreement ID format is valid and exists.
 * - Verifies the agreement is in a pending state.
 * - Enforces that the confirming email matches the counterParty email.
 * - Records IP address for audit trace/dispute resolution.
 *
 * @param {object} params - { agreementId, email, signatureText, ipAddress }
 * @returns {Promise<{ confirmation, agreement }>}
 */
export const confirmAgreement = async ({
  agreementId,
  email,
  signatureText,
  ipAddress,
}) => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  const agreement = await Agreement.findById(agreementId);
  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  if (agreement.status === 'confirmed') {
    throw new ApiError(400, 'This agreement is already confirmed');
  }

  if (agreement.status === 'cancelled') {
    throw new ApiError(400, 'This agreement has been cancelled by the creator');
  }

  // Verify counterparty email constraints if set
  if (
    agreement.counterParty?.email &&
    agreement.counterParty.email.toLowerCase() !== email.toLowerCase()
  ) {
    throw new ApiError(
      403,
      `Only the designated counterparty (${agreement.counterParty.email}) can confirm this agreement`
    );
  }

  // 1. Create Confirmation record
  const confirmation = await Confirmation.create({
    agreementId,
    email: email.toLowerCase(),
    signatureText,
    ipAddress,
  });

  // 2. Transition status and record reacted timestamp
  agreement.status = 'confirmed';
  agreement.respondedAt = new Date();

  // 3. Log into history audit
  agreement.history.push({
    action: 'confirmed',
    performedBy: email.toLowerCase(),
    note: `Digitally accepted and signed by counterparty: "${signatureText}"`,
    ipAddress,
  });

  await agreement.save();

  return { confirmation, agreement };
};

/**
 * Marks an agreement as 'needs_changes' based on counterparty revision feedback.
 *
 * @param {object} params - { agreementId, email, note, ipAddress }
 * @returns {Promise<Agreement>}
 */
export const requestChanges = async ({
  agreementId,
  email,
  note,
  ipAddress,
}) => {
  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    throw new ApiError(400, 'Invalid agreement ID format');
  }

  if (!note || note.trim().length < 5) {
    throw new ApiError(400, 'Please provide a descriptive reason for changes (min 5 characters)');
  }

  const agreement = await Agreement.findById(agreementId);
  if (!agreement) {
    throw new ApiError(404, 'Agreement not found');
  }

  if (agreement.status === 'confirmed') {
    throw new ApiError(403, 'Cannot request changes on an already confirmed agreement');
  }

  if (agreement.status === 'cancelled') {
    throw new ApiError(403, 'Agreement has been cancelled by the creator');
  }

  // Verify counterparty email constraints if set
  if (
    agreement.counterParty?.email &&
    agreement.counterParty.email.toLowerCase() !== email.toLowerCase()
  ) {
    throw new ApiError(
      403,
      `Only the designated counterparty (${agreement.counterParty.email}) can request revisions`
    );
  }

  // 1. Update agreement state
  agreement.status = 'needs_changes';
  agreement.counterPartyNote = note;
  agreement.respondedAt = new Date();

  // 2. Log into history audit
  agreement.history.push({
    action: 'needs_changes',
    performedBy: email.toLowerCase(),
    note: `Changes requested by counterparty: "${note}"`,
    ipAddress,
  });

  await agreement.save();

  return agreement;
};

export default {
  confirmAgreement,
  requestChanges,
};
