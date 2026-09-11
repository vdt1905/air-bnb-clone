import { listings } from '../data/listings.js';

// Data access + shape normalisation. Knows nothing about HTTP.
export function findById(id) {
  return listings.find((listing) => listing.id === id) ?? null;
}

export function findAll() {
  return listings;
}
