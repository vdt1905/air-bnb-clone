import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export function notFound(req, _res, next) {
  next(new ApiError(`Route not found: ${req.method} ${req.originalUrl}`, {
    status: 404,
    code: 'ROUTE_NOT_FOUND',
  }));
}

// Final handler. Must keep four args for Express to recognise it.
export function errorHandler(err, _req, res, _next) {
  const isApiError = err instanceof ApiError;
  const status = isApiError ? err.status : 500;
  const code = isApiError ? err.code : 'INTERNAL_ERROR';

  if (!isApiError || status >= 500) {
    console.error('[error]', err);
  }

  // Never leak internals in production.
  const message =
    !isApiError && env.isProduction ? 'Internal server error' : err.message;

  res.status(status).json({ success: false, error: { code, message, status } });
}
