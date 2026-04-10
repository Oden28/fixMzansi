import { cookies } from 'next/headers';
import { FM_SESSION_COOKIE, verifySessionToken } from './session-cookie';

export type AppSession = {
  userId: string;
  role: 'consumer' | 'pro' | 'admin';
  email?: string | null;
};

export async function getServerSession(): Promise<AppSession | null> {
  const jar = await cookies();
  const raw = jar.get(FM_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const payload = verifySessionToken(raw);
  if (!payload) return null;
  return { userId: payload.sub, role: payload.role, email: payload.email };
}
