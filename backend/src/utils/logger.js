import env from '../config/env.js';

const isDev = env.env === 'development';

export const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] [${new Date().toISOString()}]: ${message}`, ...args);
  },
  error: (message, error, ...args) => {
    console.error(`[ERROR] [${new Date().toISOString()}]: ${message}`, error ? error.stack || error : '', ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] [${new Date().toISOString()}]: ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (isDev) {
      console.log(`[DEBUG] [${new Date().toISOString()}]: ${message}`, ...args);
    }
  },
};

export default logger;
