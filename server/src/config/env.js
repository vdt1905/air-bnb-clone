import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/**
 * Validated environment, resolved once at boot.
 *
 * Development gets convenience defaults. Production does NOT: every value must
 * be set explicitly.
 *
 * The previous version merged defaults BEFORE the "missing required variable"
 * check, so the check could never fail and `process.exit(1)` was unreachable.
 * That mattered most for NODE_ENV: unset in production meant `isProduction`
 * was false, and the error handler returned raw internal error messages to
 * clients instead of a generic one.
 */
const DEV_DEFAULTS = {
  NODE_ENV: 'development',
  PORT: '5000',
  CLIENT_ORIGIN: 'http://localhost:5173',
};

const REQUIRED_IN_PRODUCTION = ['PORT', 'CLIENT_ORIGIN'];

function fail(message) {
  console.error(`[config] ${message}`);
  process.exit(1);
}

/**
 * On Vercel the API runs as a serverless function in the SAME project as the
 * client, so the values production normally demands are derivable:
 *   - PORT is meaningless (no listen()); any valid number satisfies validation.
 *   - CLIENT_ORIGIN is the deployment's own origin. Production uses the stable
 *     project domain; previews fall back to the per-deployment URL.
 *   - TRUST_PROXY must be on: Vercel terminates TLS and forwards the client IP
 *     in X-Forwarded-For, which the rate limiter keys on.
 * Explicit environment variables still win over every derived value.
 */
function vercelDefaults(raw) {
  if (raw.VERCEL !== '1') return {};
  const host = raw.VERCEL_PROJECT_PRODUCTION_URL || raw.VERCEL_URL;
  return {
    PORT: '3000',
    TRUST_PROXY: '1',
    ...(host ? { CLIENT_ORIGIN: `https://${host}` } : {}),
  };
}

function load() {
  const raw = process.env;
  const isProduction = raw.NODE_ENV === 'production';

  // Defaults apply outside production only — except on Vercel, where the
  // production values are derived from the platform (see vercelDefaults).
  const merged = isProduction
    ? { ...vercelDefaults(raw), ...raw }
    : { ...DEV_DEFAULTS, ...vercelDefaults(raw), ...raw };

  if (isProduction) {
    const missing = REQUIRED_IN_PRODUCTION.filter((key) => !merged[key]);
    if (missing.length > 0) {
      fail(`Missing required environment variables in production: ${missing.join(', ')}`);
    }
  }

  const port = Number(merged.PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    fail(`PORT must be an integer between 1 and 65535, received: ${merged.PORT}`);
  }

  const clientOrigin = merged.CLIENT_ORIGIN;

  // A wildcard origin would let any site read this API's responses.
  if (clientOrigin === '*') {
    fail('CLIENT_ORIGIN must be a specific origin, never "*"');
  }

  if (isProduction && !/^https?:\/\//.test(clientOrigin)) {
    fail(`CLIENT_ORIGIN must be an absolute http(s) origin, received: ${clientOrigin}`);
  }

  return {
    nodeEnv: merged.NODE_ENV ?? 'development',
    isProduction,
    port,
    clientOrigin,
    // Opt-in: only enable when actually behind a reverse proxy, because it
    // makes express trust the X-Forwarded-For header for req.ip, which is what
    // the rate limiter keys on.
    trustProxy: parseTrustProxy(merged.TRUST_PROXY),
  };
}

/**
 * Environment values are always strings, but Express's 'trust proxy' setting
 * treats a string as a list of IPs/subnets — so a literal "1" would throw
 * "invalid IP address" at boot. Map the common spellings to what Express
 * expects: booleans, a hop count, or a subnet list ("loopback, 10.0.0.0/8").
 */
function parseTrustProxy(value) {
  if (value === undefined || value === '' || value === 'false' || value === '0') return false;
  if (value === 'true') return true;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

export const env = load();
