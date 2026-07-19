import dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

// ─── Required variable guard ────────────────────────────────────────────────
// Hard-fail in production; warn in development so the dev loop stays fast.
const required = ['MONGO_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    const msg = `[Config] Missing required environment variable: ${key}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      console.warn(msg);
    }
  }
});

// ─── Centralised config object ───────────────────────────────────────────────
// Import this object everywhere instead of reading process.env directly.
const config = {
  /** Runtime environment: 'development' | 'production' | 'test' */
  env: process.env.NODE_ENV || 'development',

  /** HTTP port the Express server will listen on */
  port: parseInt(process.env.PORT || '5000', 10),

  /** MongoDB Atlas / local connection string */
  mongoUri: process.env.MONGO_URI,

  /** JWT signing secret – keep this long and random in production */
  jwtSecret: process.env.JWT_SECRET,

  /** JWT token expiry, e.g. '7d', '24h' */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  /**
   * Allowed CORS origin(s).
   * In production set to your exact frontend domain, e.g. 'https://voicekarar.app'.
   * Multiple origins can be passed as a comma-separated string:
   *   CORS_ORIGIN=https://voicekarar.app,https://www.voicekarar.app
   */
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),

  /**
   * Public base URL used to build shareable agreement links.
   * e.g. https://voicekarar.app  → link becomes https://voicekarar.app/share/abc123
   */
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:5000',

  /**
   * Internal URL of the AI Agent microservice.
   * The backend proxies all AI calls here — the frontend never talks to the AI agent directly.
   * Default: http://localhost:5001
   */
  aiAgentUrl: process.env.AI_AGENT_URL || 'http://localhost:5001',
};

export default config;
