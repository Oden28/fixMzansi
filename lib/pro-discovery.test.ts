import { describe, expect, it } from 'vitest';
import { filterPros, getDiscoveryCategories } from './pro-discovery';
import type { ProProfile } from './types';

const pros: ProProfile[] = [
  {
    id: 'pro-1',
    name: 'SolarWorks Cape',
    tradeCategory: 'solar',
    suburb: 'Claremont',
    rating: 4.9,
    verificationStatus: 'verified',
    responseTimeMinutes: 18,
    summary: 'Premium solar installer',
    profilePhotoUrl: undefined,
  },
  {
    id: 'pro-2',
    name: 'Battery Pros CT',
    tradeCategory: 'battery',
    suburb: 'Sea Point',
    rating: 4.7,
    verificationStatus: 'verified',
    responseTimeMinutes: 22,
    summary: 'Battery backup and inverter support',
    profilePhotoUrl: undefined,
  },
];

describe('getDiscoveryCategories', () => {
  it('returns all plus sorted unique categories from pros', () => {
    expect(getDiscoveryCategories(pros)).toEqual(['all', 'battery', 'solar']);
  });
});

describe('filterPros', () => {
  it('returns all records for all category with empty query', () => {
    expect(filterPros({ pros, category: 'all', query: '' })).toHaveLength(2);
  });

  it('filters by selected category', () => {
    const results = filterPros({ pros, category: 'solar', query: '' });
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('pro-1');
  });

  it('filters by search query across name, suburb, and summary', () => {
    const results = filterPros({ pros, category: 'all', query: 'sea point' });
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('pro-2');
  });
});
