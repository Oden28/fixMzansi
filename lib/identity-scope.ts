export type IdentityScope = {
  customerUserId?: string;
  proUserId?: string;
};

type ScopeSource = Record<string, unknown>;

function normalizeScopeValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return normalizeScopeValue(value[0]);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function extractIdentityScopeFromRecord(source: ScopeSource): IdentityScope {
  const customerUserId = normalizeScopeValue(source.customerUserId);
  const proUserId = normalizeScopeValue(source.proUserId);

  return {
    ...(customerUserId ? { customerUserId } : {}),
    ...(proUserId ? { proUserId } : {}),
  };
}

export function buildScopedPath(path: string, scope: IdentityScope): string {
  const [pathWithoutHash, hash = ''] = path.split('#', 2);
  const [pathname, existingQuery = ''] = pathWithoutHash.split('?', 2);
  const params = new URLSearchParams(existingQuery);

  if (scope.customerUserId) {
    params.set('customerUserId', scope.customerUserId);
  }

  if (scope.proUserId) {
    params.set('proUserId', scope.proUserId);
  }

  const queryString = params.toString();
  const scopedPath = queryString ? `${pathname}?${queryString}` : pathname;
  return hash ? `${scopedPath}#${hash}` : scopedPath;
}
