import { cookies } from 'next/headers';
import { FM_SESSION_COOKIE, verifySessionToken, type SessionTokenPayload } from './session-cookie';

/**
 * Verify the session cookie from an API route.
 * Returns the decoded payload or null if unauthenticated.
 */
export async function getApiSession(): Promise<SessionTokenPayload | null> {
  const jar = await cookies();
  const token = jar.get(FM_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** UUID v4 regex for validating IDs from client input */
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}
