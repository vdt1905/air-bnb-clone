import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * Unmatched route → 404.
 *
 * The client-facing message is fixed text. It deliberately does NOT echo
 * `req.originalUrl`: reflecting arbitrary request input back into a response
 * body is needless attack surface (log injection, and XSS the moment such a
 * message is rendered by any consumer). The path is logged server-side
 * instead, where it is actually useful.
 */
export function notFound(req, _res, next) {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  next(new ApiError('Route not found', { status: 404, code: 'ROUTE_NOT_FOUND' }));
}

/**
 * Final error handler. Must keep four arguments for Express to recognise it.
 *
 * Two classes of error:
 *   ApiError  — deliberate, with a safe message we authored. Returned as-is.
 *   anything else — unexpected. The message may contain internals (file paths,
 *                   driver errors, secrets in connection strings), so in
 *                   production it is replaced with a generic string. The full
 *                   error, stack included, only ever goes to the server log.
 */
export function errorHandler(err, req, res, _next) {
  const isApiError = err instanceof ApiError;
  const status = isApiError ? err.status : 500;
  const code = isApiError ? err.code : 'INTERNAL_ERROR';

  if (!isApiError || status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  const message = isApiError
    ? err.message
    : env.isProduction
      ? 'Internal server error'
      : err.message;

  // Stack traces are never serialised to the client, in any environment.
  res.status(status).json({ success: false, error: { code, message, status } });
}
