import { findById } from '../models/listingModel.js';
import { ApiError } from '../utils/ApiError.js';

// Business logic. Called with plain arguments, returns plain data - which is
// what makes it unit-testable without HTTP.
export function getListingById(id) {
  const listing = findById(id);
  if (!listing) {
    throw ApiError.notFound(`Listing not found: ${id}`, 'LISTING_NOT_FOUND');
  }
  return listing;
}
