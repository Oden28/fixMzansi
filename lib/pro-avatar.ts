const dicebearBaseUrl = 'https://api.dicebear.com/9.x/initials/svg';

export function buildFallbackAvatarUrl(seed: string): string {
  const safeSeed = seed.trim() || 'FixMzansi Pro';
  const params = new URLSearchParams({
    seed: safeSeed,
    backgroundColor: 'cbd5e1,86efac,93c5fd',
    textColor: '0f172a',
    bold: 'true',
  });

  return `${dicebearBaseUrl}?${params.toString()}`;
}

export function getProProfilePhotoUrl(name: string, profilePhotoUrl?: string | null): string {
  const trimmed = profilePhotoUrl?.trim();
  if (trimmed) return trimmed;
  return buildFallbackAvatarUrl(name);
}
