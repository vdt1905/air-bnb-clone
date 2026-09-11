import { describe, it, expect } from 'vitest';
import { findById, findAll } from '../src/models/listingModel.js';
import { getListingById } from '../src/services/listingService.js';
import { ApiError } from '../src/utils/ApiError.js';

describe('listingModel', () => {
  it('returns null for an unknown id rather than throwing', () => {
    expect(findById('nope')).toBeNull();
  });

  it('normalises the rating object even when values are absent', () => {
    const listing = findById('listing-002');

    expect(listing.rating).toEqual({ value: null, count: 1, isNew: true });
  });

  it('derives counts that match the underlying arrays', () => {
    const listing = findById('listing-001');

    expect(listing.photoCount).toBe(listing.photos.length);
    expect(listing.amenityCount).toBe(listing.amenities.length);
  });

  it('gives every photo an id, dimensions and a room', () => {
    const { photos } = findById('listing-001');

    const ids = new Set(photos.map((p) => p.id));
    expect(ids.size).toBe(photos.length); // ids are unique

    for (const photo of photos) {
      expect(photo.width).toBe(1440);
      expect(photo.height).toBe(960);
      expect(photo.room).toBeTruthy();
    }
  });

  it('normalises every listing in findAll', () => {
    const all = findAll();

    expect(all).toHaveLength(2);
    for (const listing of all) {
      expect(listing.rating).toHaveProperty('isNew');
      expect(Array.isArray(listing.photos)).toBe(true);
    }
  });
});

describe('listingService', () => {
  it('is callable with a plain id and returns plain data — no HTTP objects', () => {
    const listing = getListingById('listing-001');

    expect(listing.id).toBe('listing-001');
    expect(listing).not.toHaveProperty('req');
    expect(listing).not.toHaveProperty('res');
  });

  it('throws an ApiError with a 404 status when the listing is missing', () => {
    let thrown;
    try {
      getListingById('missing');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(ApiError);
    expect(thrown.status).toBe(404);
    expect(thrown.code).toBe('LISTING_NOT_FOUND');
    expect(thrown.isOperational).toBe(true);
  });
});

describe('ApiError', () => {
  it('defaults to a 500 internal error', () => {
    const error = new ApiError('boom');

    expect(error.status).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
  });

  it('builds 400 and 404 helpers', () => {
    expect(ApiError.badRequest('bad').status).toBe(400);
    expect(ApiError.notFound('gone').status).toBe(404);
  });
});
