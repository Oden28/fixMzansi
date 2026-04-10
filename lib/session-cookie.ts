import { createHmac, timingSafeEqual } from 'crypto';

export const FM_SESSION_COOKIE = 'fm_session';

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET is required in production');
    }
    return 'fixmzansi-dev-session-secret-min-32-chars!!';
  }
  return s;
}

export type SessionTokenPayload = {
  sub: string;
  role: 'consumer' | 'pro' | 'admin';
  email?: string | null;
  exp: number;
};

export function signSession(payload: Omit<SessionTokenPayload, 'exp'>): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const full: SessionTokenPayload = { ...payload, exp };
  const body = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expected = createHmac('sha256', getSecret()).update(body).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionTokenPayload;
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    if (!data.sub || !data.role) return null;
    if (!['consumer', 'pro', 'admin'].includes(data.role)) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SEC,
  };
}
