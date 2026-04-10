import type { IdentityScope } from './identity-scope';
import type { AppSession } from './server-session';

/**
 * Authenticated users are scoped by the session only (ignore URL spoofing).
 * Guests keep demo-style query-param scope from the product architecture docs.
 */
export function mergeNavScope(urlScope: IdentityScope, session: AppSession | null): IdentityScope {
  if (session?.role === 'consumer') {
    return { customerUserId: session.userId };
  }
  if (session?.role === 'pro') {
    return { proUserId: session.userId };
  }
  if (session?.role === 'admin') {
    return {};
  }
  return urlScope;
}
