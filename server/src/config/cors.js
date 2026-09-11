import { env } from './env.js';

// One configured origin. Never "*".
export const corsOptions = {
  origin: env.clientOrigin,
  methods: ['GET'],
  credentials: false,
  maxAge: 600,
};
