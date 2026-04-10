import { describe, expect, it } from 'vitest';
import { buildScopedPath, extractIdentityScopeFromRecord } from './identity-scope';

describe('extractIdentityScopeFromRecord', () => {
  it('returns scoped ids when present', () => {
    expect(
      extractIdentityScopeFromRecord({
        customerUserId: 'customer-1',
        proUserId: 'pro-1',
      }),
    ).toEqual({ customerUserId: 'customer-1', proUserId: 'pro-1' });
  });

  it('omits empty values and trims whitespace', () => {
    expect(
      extractIdentityScopeFromRecord({
        customerUserId: '  ',
        proUserId: '  pro-2  ',
      }),
    ).toEqual({ proUserId: 'pro-2' });
  });

  it('supports array query values by taking first entry', () => {
    expect(
      extractIdentityScopeFromRecord({
        customerUserId: ['customer-3', 'customer-4'],
      }),
    ).toEqual({ customerUserId: 'customer-3' });
  });
});

describe('buildScopedPath', () => {
  it('appends scope query params to a clean path', () => {
    expect(buildScopedPath('/requests/abc', { customerUserId: 'customer-1' })).toBe('/requests/abc?customerUserId=customer-1');
  });

  it('preserves existing query params while appending scope params', () => {
    expect(buildScopedPath('/dashboard?tab=overview', { customerUserId: 'customer-1', proUserId: 'pro-2' })).toBe(
      '/dashboard?tab=overview&customerUserId=customer-1&proUserId=pro-2',
    );
  });

  it('returns original path when no scope values exist', () => {
    expect(buildScopedPath('/notifications', {})).toBe('/notifications');
  });
});
