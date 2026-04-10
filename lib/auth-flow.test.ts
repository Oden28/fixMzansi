import { describe, expect, it } from 'vitest';
import { buildAuthNextPath, mapAuthRoleToDbRole, type AuthRole } from './auth-flow';

describe('mapAuthRoleToDbRole', () => {
  it('maps customer app role to consumer database role', () => {
    expect(mapAuthRoleToDbRole('customer')).toBe('consumer');
  });

  it('passes through pro and admin roles', () => {
    expect(mapAuthRoleToDbRole('pro')).toBe('pro');
    expect(mapAuthRoleToDbRole('admin')).toBe('admin');
  });
});

describe('buildAuthNextPath', () => {
  it('routes customer accounts to scoped customer dashboard', () => {
    expect(buildAuthNextPath({ id: 'user-1', role: 'customer' })).toBe('/dashboard?customerUserId=user-1');
  });

  it('routes pro accounts to scoped pro dashboard', () => {
    expect(buildAuthNextPath({ id: 'user-2', role: 'pro' })).toBe('/pro-dashboard?proUserId=user-2');
  });

  it('routes admin accounts to admin workspace', () => {
    expect(buildAuthNextPath({ id: 'user-3', role: 'admin' })).toBe('/admin');
  });

  it('accepts persisted consumer role for customers', () => {
    expect(buildAuthNextPath({ id: 'user-4', role: 'consumer' })).toBe('/dashboard?customerUserId=user-4');
  });

  it('uses requested role as fallback when account role is unavailable', () => {
    const requestedRole: AuthRole = 'customer';
    expect(buildAuthNextPath({ id: 'user-5', role: null, requestedRole })).toBe('/dashboard?customerUserId=user-5');
  });
});
