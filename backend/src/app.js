import express from 'express';
import cors from 'cors';
import config from './config/env.js';

// ─── Route Imports ───────────────────────────────────────────────────────────
import healthRoutes       from './routes/health.routes.js';
import authRoutes         from './routes/auth.routes.js';
import agreementRoutes    from './routes/agreement.routes.js';
import confirmationRoutes from './routes/confirmation.routes.js';
import dashboardRoutes    from './routes/dashboard.routes.js';
import aiRoutes           from './routes/ai.routes.js';

// ─── Middleware Imports ───────────────────────────────────────────────────────
import { notFound }    from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

// ─── App Initialisation ───────────────────────────────────────────────────────
const app = express();

// ─── Security / Global Middleware ─────────────────────────────────────────────

/**
 * CORS
 * corsOrigin is always an array (see config/env.js).
 * In production, set CORS_ORIGIN to your exact React frontend domain.
 */
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Body parsers
 * 50 mb limit covers base64-encoded audio recordings sent from the frontend.
 * The AI Agent also accepts up to 50 mb — keep both in sync.
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * Health check – no auth, no versioning prefix intentionally.
 * Allows uptime monitors / load-balancer probes to hit /api/health.
 */
app.use('/api/health', healthRoutes);

/**
 * Versioned API routes.
 * All business endpoints live under /api/v1/ so the client can
 * pin to a specific API version as the product evolves.
 */
app.use('/api/v1/auth',          authRoutes);
app.use('/api/v1/agreements',    agreementRoutes);
app.use('/api/v1/confirmations', confirmationRoutes);
app.use('/api/v1/dashboard',     dashboardRoutes);
app.use('/api/v1/ai',            aiRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 – must be registered AFTER all valid routes
app.use(notFound);

// Global error handler – must be the LAST middleware (4 params)
app.use(errorHandler);

export default app;
