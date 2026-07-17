import express from 'express';
import cors from 'cors';
import config from './config/env.js';

// ─── Route Imports ───────────────────────────────────────────────────────────
import healthRoutes       from './routes/health.routes.js';
import authRoutes         from './routes/auth.routes.js';
import agreementRoutes    from './routes/agreement.routes.js';
import confirmationRoutes from './routes/confirmation.routes.js';
import dashboardRoutes    from './routes/dashboard.routes.js';

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
 * 10 mb limit covers base64-encoded audio thumbnails if the frontend
 * ever sends one; tighten this in production if not needed.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 – must be registered AFTER all valid routes
app.use(notFound);

// Global error handler – must be the LAST middleware (4 params)
app.use(errorHandler);

export default app;
