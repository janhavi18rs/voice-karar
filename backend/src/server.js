import app from './app.js';
import { config, connectDB, disconnectDB } from './config/index.js';

// ─── Graceful shutdown helper ────────────────────────────────────────────────
/**
 * Closes the HTTP server, waits for in-flight requests to finish,
 * then disconnects from MongoDB before exiting.
 *
 * @param {import('http').Server} server
 * @param {number} code - process exit code
 */
const gracefulShutdown = async (server, code = 0) => {
  console.log('\n[Server] Graceful shutdown initiated...');
  server.close(async () => {
    try {
      await disconnectDB();
      console.log('[Server] Shutdown complete. Exiting.');
    } catch (err) {
      console.error('[Server] Error during shutdown:', err.message);
    } finally {
      process.exit(code);
    }
  });
};

// ─── Bootstrap ───────────────────────────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB FIRST – fail fast before binding the port.
  await connectDB();

  // 2. Start listening.
  const server = app.listen(config.port, () => {
    console.log(
      `[Server] Running in ${config.env} mode → http://localhost:${config.port}`
    );
    console.log(`[Server] API base: http://localhost:${config.port}/api/v1`);
  });

  // ─── Process signal handlers ──────────────────────────────────────────────

  // SIGTERM  – sent by Docker, Kubernetes, Heroku, etc. during rolling deploys
  process.on('SIGTERM', () => {
    console.warn('[Server] SIGTERM received.');
    gracefulShutdown(server, 0);
  });

  // SIGINT   – Ctrl+C in terminal during local development
  process.on('SIGINT', () => {
    console.warn('[Server] SIGINT received (Ctrl+C).');
    gracefulShutdown(server, 0);
  });

  // Unhandled promise rejections – log and shut down cleanly
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Promise Rejection:', reason);
    gracefulShutdown(server, 1);
  });

  // Uncaught synchronous exceptions – must exit; state is unpredictable
  process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught Exception:', err.message);
    gracefulShutdown(server, 1);
  });
};

// ─── Entry point ─────────────────────────────────────────────────────────────
startServer().catch((err) => {
  console.error('[Server] Fatal error during startup:', err.message);
  process.exit(1);
});
