import Agreement from '../models/Agreement.js';
import mongoose from 'mongoose';

/**
 * Computes dashboard stats and recent agreements list for the logged-in creator.
 *
 * Uses MongoDB Aggregation to avoid fetching all documents into application memory,
 * which keeps queries fast and memory usage low even as databases grow.
 *
 * @param {string} userId - MongoDB _id of the creator
 * @returns {Promise<{ stats: { total, pending, confirmed, needsChanges, cancelled }, recentAgreements }>}
 */
export const getUserDashboardStats = async (userId) => {
  const creatorId = new mongoose.Types.ObjectId(userId);

  // 1. Compute status counts in a single aggregation pass
  const aggregationResult = await Agreement.aggregate([
    { $match: { creator: creatorId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Map aggregation output to structured stats counters
  const stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    needsChanges: 0,
    cancelled: 0,
  };

  aggregationResult.forEach((item) => {
    const statusKey = item._id; // 'pending' | 'confirmed' | 'needs_changes' | 'cancelled'
    const count = item.count;

    if (statusKey === 'pending') stats.pending = count;
    else if (statusKey === 'confirmed') stats.confirmed = count;
    else if (statusKey === 'needs_changes') stats.needsChanges = count;
    else if (statusKey === 'cancelled') stats.cancelled = count;

    stats.total += count;
  });

  // 2. Fetch the 5 most recently created/updated agreements (uses compound index)
  const recentAgreements = await Agreement.find({ creator: creatorId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status counterParty respondedAt createdAt updatedAt');

  return {
    stats,
    recentAgreements,
  };
};

export default {
  getUserDashboardStats,
};
