import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['PORT', 'CLIENT_ORIGIN'];

const DEFAULTS = {
  NODE_ENV: 'development',
  PORT: '5000',
  CLIENT_ORIGIN: 'http://localhost:5173',
};

function load() {
  const merged = { ...DEFAULTS, ...process.env };

  const missing = REQUIRED.filter((key) => !merged[key]);
  if (missing.length > 0) {
    // Fail fast, loudly, at boot - never halfway through a request.
    console.error(`[config] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const port = Number(merged.PORT);
  if (!Number.isInteger(port) || port <= 0) {
    console.error(`[config] PORT must be a positive integer, received: ${merged.PORT}`);
    process.exit(1);
  }

  return {
    nodeEnv: merged.NODE_ENV,
    isProduction: merged.NODE_ENV === 'production',
    port,
    clientOrigin: merged.CLIENT_ORIGIN,
  };
}

export const env = load();
