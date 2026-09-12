import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import app from '../src/app.js';
import { notFound, errorHandler } from '../src/middleware/errorMiddleware.js';
import { ApiError } from '../src/utils/ApiError.js';

describe('security headers', () => {
  it('sets helmet headers and hides the framework', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('advertises a rate limit policy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['ratelimit-policy']).toBeDefined();
  });
});

describe('CORS', () => {
  it('reflects only the configured origin, never a wildcard', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');

    expect(res.headers['access-control-allow-origin']).not.toBe('*');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});

describe('input validation', () => {
  it.each([
    ['path traversal', '..%2F..%2Fetc%2Fpasswd'],
    ['script tag', '%3Cscript%3Ealert(1)%3C%2Fscript%3E'],
    ['sql-ish', "1'%20OR%20'1'%3D'1"],
    ['null byte', 'abc%00def'],
    ['over-length', 'a'.repeat(65)],
    ['unicode', '%E2%80%AE%E2%80%8B'],
  ])('rejects a %s id with 400 before any lookup', async (_label, id) => {
    const res = await request(app).get(`/api/listings/${id}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_LISTING_ID');
  });

  it('accepts only the documented id charset', async () => {
    const ok = await request(app).get('/api/listings/listing-001');
    expect(ok.status).toBe(200);
  });
});

describe('error responses', () => {
  it('never echoes the requested URL back to the client', async () => {
    const marker = 'REFLECTED_MARKER_9271';
    const res = await request(app).get(`/api/${marker}`);

    expect(res.status).toBe(404);
    expect(JSON.stringify(res.body)).not.toContain(marker);
    expect(res.body.error.message).toBe('Route not found');
  });

  it('never serialises a stack trace', async () => {
    const res = await request(app).get('/api/listings/unknown-id');
    const body = JSON.stringify(res.body);

    expect(body).not.toMatch(/at \w+ \(/);
    expect(res.body.error).not.toHaveProperty('stack');
    expect(res.body).not.toHaveProperty('stack');
  });

  it('uses a consistent envelope for every failure', async () => {
    for (const path of ['/api/listings/bad!!id', '/api/listings/unknown-id', '/api/nope']) {
      const res = await request(path.includes('!') ? app : app).get(path);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatchObject({
        code: expect.any(String),
        message: expect.any(String),
        status: expect.any(Number),
      });
    }
  });
});

/**
 * The 500 path cannot be reached through the real routes — nothing throws
 * unexpectedly — so it is exercised on a throwaway app that mounts the same
 * error middleware behind a deliberately exploding route.
 */
function appThatThrows() {
  const a = express();
  a.get('/boom', () => {
    throw new Error('DB connection failed: postgres://admin:hunter2@10.0.0.5/prod');
  });
  a.get('/api-boom', (_req, _res, next) => next(ApiError.notFound('Listing not found: abc')));
  a.use(notFound);
  a.use(errorHandler);
  return a;
}

describe('internal error masking', () => {
  const original = process.env.NODE_ENV;

  beforeEach(() => vi.resetModules());
  afterEach(() => {
    process.env.NODE_ENV = original;
    vi.restoreAllMocks();
  });

  it('leaks nothing from an unexpected error in production', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.NODE_ENV = 'production';
    vi.resetModules();

    const { errorHandler: prodHandler, notFound: prodNotFound } = await import(
      '../src/middleware/errorMiddleware.js?prod'
    );

    const a = express();
    a.get('/boom', () => {
      throw new Error('DB connection failed: postgres://admin:hunter2@10.0.0.5/prod');
    });
    a.use(prodNotFound);
    a.use(prodHandler);

    const res = await request(a).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body.error.message).toBe('Internal server error');
    expect(JSON.stringify(res.body)).not.toContain('hunter2');
    expect(JSON.stringify(res.body)).not.toContain('postgres');
    expect(JSON.stringify(res.body)).not.toContain('10.0.0.5');
  });

  it('still returns our own ApiError messages verbatim', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(appThatThrows()).get('/api-boom');

    expect(res.status).toBe(404);
    expect(res.body.error.message).toContain('Listing not found');
  });
});

describe('method handling', () => {
  it.each(['post', 'put', 'patch', 'delete'])(
    'does not expose %s on the listing route',
    async (method) => {
      const res = await request(app)[method]('/api/listings/listing-001');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    }
  );

  it('ignores an unexpected request body rather than parsing it', async () => {
    const res = await request(app)
      .get('/api/listings/listing-001')
      .set('Content-Type', 'application/json')
      .send('{"malicious":"' + 'x'.repeat(1000) + '"}');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
