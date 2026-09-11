import { apiClient } from './apiClient.js';
import { ENDPOINTS } from '../constants/api.js';

export function getListing(id) {
  return apiClient.get(ENDPOINTS.listing(id));
}
