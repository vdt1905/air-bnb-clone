import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const VALID_ID = 'listing-001';
const NEW_ID = 'listing-002';

describe('GET /api/health', () => {
  it('returns 200 with the success envelope', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('GET /api/listings/:id — success', () => {
  it('returns 200 and the documented payload shape', async () => {
    const res = await request(app).get(`/api/listings/${VALID_ID}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.success).toBe(true);

    const listing = res.body.data;
    for (const key of [
      'id', 'title', 'propertyType', 'location', 'capacity', 'rating',
      'photos', 'roomGroups', 'host', 'highlights', 'description',
      'amenities', 'sleepingArrangements', 'pricing', 'availability',
      'reviews', 'policies',
    ]) {
      expect(listing, `missing key: ${key}`).toHaveProperty(key);
    }
  });

  it('carries exactly 34 photos, each 3:2 and tagged with a room', async () => {
    const { body } = await request(app).get(`/api/listings/${VALID_ID}`);
    const { photos, roomGroups } = body.data;

    expect(photos).toHaveLength(34);

    const groupNames = new Set(roomGroups.map((g) => g.name));
    expect(groupNames.size).toBe(9);

    for (const photo of photos) {
      expect(photo.room).toBeTruthy();
      expect(groupNames.has(photo.room)).toBe(true);
      expect(photo.width / photo.height).toBeCloseTo(3 / 2, 5);
      expect(photo.alt).not.toBe('');
    }
  });

  it('keeps unavailable amenities in the payload rather than filtering them', async () => {
    const { body } = await request(app).get(`/api/listings/${VALID_ID}`);
    const { amenities } = body.data;

    expect(amenities.length).toBeGreaterThanOrEqual(16);
    expect(amenities.filter((a) => a.available === false).length).toBeGreaterThanOrEqual(2);
  });

  it('returns a description long enough to exceed the 8-line clamp', async () => {
    const { body } = await request(app).get(`/api/listings/${VALID_ID}`);
    // ~85 chars per line at 16px across the measured 653.3px column.
    expect(body.data.description.summary.length).toBeGreaterThan(680);
  });

  it('emits raw values, never formatted strings', async () => {
    const { body } = await request(app).get(`/api/listings/${VALID_ID}`);
    const listing = body.data;

    expect(typeof listing.pricing.nightlyRate).toBe('number');
    expect(listing.pricing.currency).toBe('INR');

    for (const date of listing.availability.blockedDates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    for (const review of listing.reviews) {
      expect(review.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('exposes a new listing whose rating renders the "New" path', async () => {
    const { body } = await request(app).get(`/api/listings/${NEW_ID}`);

    expect(body.data.rating.isNew).toBe(true);
    expect(body.data.rating.value).toBeNull();
    expect(body.data.rating.count).toBe(1);
  });

  it('has at least one blocked date range and at least three reviews', async () => {
    const { body } = await request(app).get(`/api/listings/${VALID_ID}`);

    expect(body.data.availability.blockedDates.length).toBeGreaterThan(0);
    expect(body.data.reviews.length).toBeGreaterThanOrEqual(3);
  });
});

describe('GET /api/listings/:id — errors', () => {
  it('returns 404 LISTING_NOT_FOUND for an unknown id', async () => {
    const res = await request(app).get('/api/listings/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'LISTING_NOT_FOUND',
        message: expect.stringContaining('does-not-exist'),
        status: 404,
      },
    });
  });

  it.each([
    ['contains punctuation', 'bad!!id'],
    ['contains a space', 'bad id'],
    ['contains a slash-encoded segment', 'bad%2Fid'],
    ['exceeds the length cap', 'a'.repeat(65)],
  ])('returns 400 INVALID_LISTING_ID when the id %s', async (_label, id) => {
    const res = await request(app).get(`/api/listings/${id}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_LISTING_ID');
  });

  it('validates BEFORE lookup — a malformed id is 400, not 404', async () => {
    const malformed = await request(app).get('/api/listings/not@valid');
    const unknown = await request(app).get('/api/listings/unknown-but-valid');

    expect(malformed.status).toBe(400);
    expect(unknown.status).toBe(404);
  });

  it('returns 404 ROUTE_NOT_FOUND for an unmatched route', async () => {
    const res = await request(app).get('/api/nope');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });

  it('rejects a non-GET method on the listing route', async () => {
    const res = await request(app).post(`/api/listings/${VALID_ID}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('security', () => {
  it('sets helmet headers and hides the framework', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('advertises a rate limit policy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['ratelimit-policy']).toBeDefined();
  });
});
