/**
 * src/config/index.js
 *
 * Central barrel export for all configuration modules.
 * Import from here instead of from individual config files —
 * this keeps import paths short and makes refactoring easier.
 *
 * Usage:
 *   import { config, connectDB, disconnectDB, getDBStatus } from '../config/index.js';
 */

export { default as config } from './env.js';
export { connectDB, disconnectDB, getDBStatus } from './db.js';
