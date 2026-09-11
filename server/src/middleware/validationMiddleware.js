import { ApiError } from '../utils/ApiError.js';

const LISTING_ID = /^[a-zA-Z0-9_-]{1,64}$/;

// Runs before the controller so a malformed id is a 400, never a 404.
export function validateListingId(req, _res, next) {
  const { id } = req.params;
  if (!LISTING_ID.test(id ?? '')) {
    return next(ApiError.badRequest('Invalid listing id format', 'INVALID_LISTING_ID'));
  }
  return next();
}
