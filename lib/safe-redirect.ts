/** Internal path only — blocks open redirects. */
export function safeInternalPath(next: string | undefined | null): string | undefined {
  if (typeof next !== 'string') return undefined;
  const t = next.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return undefined;
  return t;
}
