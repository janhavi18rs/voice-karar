import dashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * GET /api/v1/dashboard
 *
 * Retrieves dashboard counters and the list of recent agreements for the logged-in user.
 * Auth: required
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await dashboardService.getUserDashboardStats(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, data, 'Dashboard stats retrieved successfully'));
  } catch (err) {
    next(err);
  }
};

export default {
  getDashboardStats,
};
