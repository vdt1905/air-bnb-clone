// Dev requests go to /api and Vite proxies them to the Express server.
// In production the client is served as static files and API_BASE_URL
// should point at the deployed server origin.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const ENDPOINTS = {
  listing: (id) => `/listings/${id}`,
  health: () => '/health',
};

export const DEFAULT_LISTING_ID = 'listing-001';
