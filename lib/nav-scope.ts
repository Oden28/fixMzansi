import { extractIdentityScopeFromRecord, type IdentityScope } from './identity-scope';

export function extractIdentityScopeFromSearchParams(params: URLSearchParams): IdentityScope {
  return extractIdentityScopeFromRecord({
    customerUserId: params.get('customerUserId') ?? undefined,
    proUserId: params.get('proUserId') ?? undefined,
  });
}
