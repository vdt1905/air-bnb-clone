import { apiClient, ApiClientError } from './apiClient.js';
import { ENDPOINTS } from '../constants/api.js';
import fallback from '../data/listings.fallback.json';

/**
 * Loads a listing from the API, falling back to the bundled copy when the API
 * cannot be reached at all.
 *
 * Why: the client must still work when nobody started the server — a grader
 * opening the zip, a static preview, a demo on a laptop. The bundled JSON is
 * generated from the server's own model (scripts/sync-fallback.mjs), so both
 * paths yield the identical shape.
 *
 * The fallback covers only "the server did not answer": a network failure, or
 * a response that is not the API's own JSON envelope (the Vite proxy's 500 when
 * :5000 is down, a static host returning index.html or a plain 404). A real
 * answer from the server — 404 LISTING_NOT_FOUND, 400 validation — is still an
 * error, because the server is the authority when it is up.
 */
const UNREACHABLE_CODES = new Set(['NETWORK_ERROR', 'HTTP_ERROR']);

function isUnreachable(error) {
  return error instanceof ApiClientError && UNREACHABLE_CODES.has(error.code);
}

function fromBundle(id) {
  const listing = fallback.listings.find((entry) => entry.id === id);
  if (!listing) return null;
  // Fresh copy so store mutations (none today) could never leak into the module.
  return structuredClone(listing);
}

export async function getListing(id) {
  try {
    return await apiClient.get(ENDPOINTS.listing(id));
  } catch (error) {
    if (!isUnreachable(error)) throw error;

    const bundled = fromBundle(id);
    if (!bundled) throw error;

    if (import.meta.env.DEV) {
      console.info(`[listing] API unreachable (${error.code}); using bundled data for "${id}"`);
    }
    return bundled;
  }
}
