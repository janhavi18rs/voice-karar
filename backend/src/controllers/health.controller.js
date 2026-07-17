import { getDBStatus } from '../config/index.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * GET /api/health
 *
 * Lightweight probe used by:
 *  - Uptime monitors
 *  - Load balancer health checks
 *  - Docker / Kubernetes liveness probes
 *
 * Returns 200 only when the DB connection is healthy.
 * Returns 503 when the DB is down so the load balancer can remove
 * this instance from rotation automatically.
 */
export const checkHealth = (_req, res) => {
  const db = getDBStatus();

  const payload = {
    status: db.ready ? 'healthy' : 'degraded',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    services: {
      database: db.status,
    },
  };

  const httpStatus = db.ready ? 200 : 503;
  return res
    .status(httpStatus)
    .json(new ApiResponse(httpStatus, payload, payload.status));
};

export default { checkHealth };
