import { describe, expect, it } from 'vitest';
import { loopbackSameSite, originAllowedForRequest, requestHostURL } from './api-origin';

describe('loopbackSameSite', () => {
  it('treats localhost and 127.0.0.1 as same site when ports match', () => {
    const a = new URL('http://localhost:3000');
    const b = new URL('http://127.0.0.1:3000');
    expect(loopbackSameSite(a, b)).toBe(true);
  });

  it('rejects different ports on loopback', () => {
    const a = new URL('http://localhost:3000');
    const b = new URL('http://127.0.0.1:4000');
    expect(loopbackSameSite(a, b)).toBe(false);
  });
});

describe('requestHostURL', () => {
  it('prefers x-forwarded-host', () => {
    const req = new Request('http://internal/api/foo', {
      headers: {
        host: 'internal',
        'x-forwarded-host': 'app.example.com',
      },
    });
    const u = requestHostURL(req);
    expect(u?.host).toBe('app.example.com');
  });
});

describe('originAllowedForRequest', () => {
  it('allows matching host', () => {
    const req = new Request('http://localhost:3000/api/auth', {
      headers: { host: 'localhost:3000' },
    });
    expect(originAllowedForRequest(req, 'http://localhost:3000')).toBe(true);
  });

  it('allows loopback mismatch with same port', () => {
    const req = new Request('http://127.0.0.1:3000/api/auth', {
      headers: { host: '127.0.0.1:3000' },
    });
    expect(originAllowedForRequest(req, 'http://localhost:3000')).toBe(true);
  });
});
