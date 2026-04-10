import { describe, expect, it } from 'vitest';
import { buildFallbackAvatarUrl, getProProfilePhotoUrl } from './pro-avatar';

describe('buildFallbackAvatarUrl', () => {
  it('builds a deterministic initials avatar URL', () => {
    expect(buildFallbackAvatarUrl('SolarWorks Cape')).toContain('seed=SolarWorks+Cape');
  });
});

describe('getProProfilePhotoUrl', () => {
  it('returns explicit profile photo url when available', () => {
    expect(getProProfilePhotoUrl('SolarWorks Cape', 'https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg');
  });

  it('falls back to deterministic avatar when no profile photo exists', () => {
    const url = getProProfilePhotoUrl('SolarWorks Cape', undefined);
    expect(url).toContain('api.dicebear.com');
    expect(url).toContain('seed=SolarWorks+Cape');
  });
});
