import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app.js';

describe('sécurité — rate limiting', () => {
  it('refuse (429) le 31e appel consécutif sur /api/auth', async () => {
    let saw429 = false;
    for (let i = 0; i < 31; i++) {
      const res = await request(app).get('/api/auth/me');
      if (res.status === 429) {
        saw429 = true;
      }
    }
    expect(saw429).toBe(true);

    const last = await request(app).get('/api/auth/me');
    expect(last.status).toBe(429);
    expect(last.body.error.code).toBe('RATE_LIMITED');
  });

  it('laisse passer les webhooks Stripe (exclus du limiteur)', async () => {
    const res = await request(app).post('/api/webhooks/stripe').set('Content-Type', 'application/json').send({});
    expect(res.status).not.toBe(429);
  });
});