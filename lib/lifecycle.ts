export function deriveRequestStatusAfterMatching(matchCount: number): 'submitted' | 'matched' {
  const normalizedCount = Number.isFinite(matchCount) ? Math.max(0, Math.floor(matchCount)) : 0;
  return normalizedCount > 0 ? 'matched' : 'submitted';
}
