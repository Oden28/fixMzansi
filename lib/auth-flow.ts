export type AuthRole = 'customer' | 'pro' | 'admin';
export type PersistedAuthRole = 'consumer' | 'pro' | 'admin' | 'customer' | null | undefined;

/** Whether the role selected in the form matches the account stored in the database. */
export function requestedRoleMatchesDb(requested: AuthRole, dbRole: string): boolean {
  if (requested === 'customer') return dbRole === 'consumer';
  return dbRole === requested;
}

export function mapAuthRoleToDbRole(role: AuthRole): 'consumer' | 'pro' | 'admin' {
  if (role === 'customer') return 'consumer';
  return role;
}

export function buildAuthNextPath({
  role,
  requestedRole,
}: {
  id: string;
  role: PersistedAuthRole;
  requestedRole?: AuthRole;
}): string {
  const effectiveRole = role ?? requestedRole;

  if (effectiveRole === 'admin') {
    return '/admin';
  }

  if (effectiveRole === 'pro') {
    return '/pro-dashboard';
  }

  return '/dashboard';
}

export function buildAuthScope({
  id,
  role,
  requestedRole,
}: {
  id: string;
  role: PersistedAuthRole;
  requestedRole?: AuthRole;
}): { customerUserId?: string; proUserId?: string } {
  const effectiveRole = role ?? requestedRole;

  if (effectiveRole === 'pro') {
    return { proUserId: id };
  }

  if (effectiveRole === 'admin') {
    return {};
  }

  return { customerUserId: id };
}
