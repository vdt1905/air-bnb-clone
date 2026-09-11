import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { corsOptions } from '../config/cors.js';

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

// Ordered: headers -> origin -> body cap -> rate limit.
export const securityMiddleware = [
  helmet(),
  cors(corsOptions),
  express.json({ limit: '10kb' }),
  limiter,
];
