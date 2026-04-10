import { describe, expect, it } from 'vitest';
import { extractIdentityScopeFromSearchParams } from './nav-scope';

describe('extractIdentityScopeFromSearchParams', () => {
  it('extracts both customer and pro ids when present', () => {
    const params = new URLSearchParams('customerUserId=c-1&proUserId=p-1');
    expect(extractIdentityScopeFromSearchParams(params)).toEqual({ customerUserId: 'c-1', proUserId: 'p-1' });
  });

  it('returns empty scope when no ids are present', () => {
    const params = new URLSearchParams('tab=overview');
    expect(extractIdentityScopeFromSearchParams(params)).toEqual({});
  });
});
