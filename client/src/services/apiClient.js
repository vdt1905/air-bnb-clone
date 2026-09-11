import { API_BASE_URL } from '../constants/api.js';

export class ApiClientError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN' } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// Normalises every failure mode (network, non-2xx, malformed body) into one
// shape so callers never branch on fetch internals.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiClientError('Network request failed', { code: 'NETWORK_ERROR' });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new ApiClientError(payload?.error?.message ?? 'Request failed', {
      status: response.status,
      code: payload?.error?.code ?? 'HTTP_ERROR',
    });
  }

  return payload.data;
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
};
