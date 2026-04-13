import { describe, expect, it } from 'vitest';
import { buildAuthNextPath, buildAuthScope, mapAuthRoleToDbRole, type AuthRole } from './auth-flow';

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
  it('routes customer accounts to customer dashboard', () => {
    expect(buildAuthNextPath({ id: 'user-1', role: 'customer' })).toBe('/dashboard');
  });

  it('routes consumer (persisted) accounts to customer dashboard', () => {
    expect(buildAuthNextPath({ id: 'user-1', role: 'consumer' })).toBe('/dashboard');
  });

  it('routes pro accounts to pro dashboard', () => {
    expect(buildAuthNextPath({ id: 'user-2', role: 'pro' })).toBe('/pro-dashboard');
  });

  it('routes admin accounts to admin workspace', () => {
    expect(buildAuthNextPath({ id: 'user-3', role: 'admin' })).toBe('/admin');
  });

  it('uses requestedRole as fallback when account role is null', () => {
    const requestedRole: AuthRole = 'customer';
    expect(buildAuthNextPath({ id: 'user-5', role: null, requestedRole })).toBe('/dashboard');
  });

  it('defaults to dashboard when both role and requestedRole are absent', () => {
    expect(buildAuthNextPath({ id: 'user-6', role: null })).toBe('/dashboard');
  });
});

describe('buildAuthScope', () => {
  it('returns customerUserId for consumer role', () => {
    expect(buildAuthScope({ id: 'u1', role: 'consumer' })).toEqual({ customerUserId: 'u1' });
  });

  it('returns proUserId for pro role', () => {
    expect(buildAuthScope({ id: 'u2', role: 'pro' })).toEqual({ proUserId: 'u2' });
  });

  it('returns empty scope for admin role', () => {
    expect(buildAuthScope({ id: 'u3', role: 'admin' })).toEqual({});
  });

  it('falls back to requestedRole when role is null', () => {
    expect(buildAuthScope({ id: 'u4', role: null, requestedRole: 'customer' })).toEqual({ customerUserId: 'u4' });
  });
});
