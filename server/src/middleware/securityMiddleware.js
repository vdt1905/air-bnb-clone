import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { corsOptions } from '../config/cors.js';

/**
 * Blunt abuse protection. Keys on req.ip, which is why `trust proxy` must be
 * set correctly when deployed behind a reverse proxy — see app.js.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests', status: 429 },
  },
});

/**
 * Ordered: security headers -> origin policy -> rate limit.
 *
 * No body parser: this API is read-only and no route consumes a request body,
 * so parsing one would be attack surface (JSON parse cost) bought for nothing.
 * Add `express.json({ limit: '10kb' })` here if a write endpoint is ever added.
 */
export const securityMiddleware = [helmet(), cors(corsOptions), limiter];
