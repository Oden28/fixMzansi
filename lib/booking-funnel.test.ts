import { describe, expect, it } from 'vitest';
import {
  estimateMarketplaceSignals,
  formatZar,
  parseBookingBrowseFilters,
  type BookingBrowseFilters,
  matchesBookingBrowseFilters,
} from './booking-funnel';

describe('parseBookingBrowseFilters', () => {
  it('returns sane defaults when query is empty', () => {
    expect(parseBookingBrowseFilters({})).toEqual({
      date: 'today',
      timeOfDay: 'flexible',
      priceRange: 'all',
      proType: 'all',
    });
  });

  it('keeps only known values and falls back for unknown input', () => {
    expect(
      parseBookingBrowseFilters({
        date: 'within_3_days',
        timeOfDay: 'morning',
        priceRange: 'budget',
        proType: 'elite',
      }),
    ).toEqual({
      date: 'within_3_days',
      timeOfDay: 'morning',
      priceRange: 'budget',
      proType: 'elite',
    });

    expect(
      parseBookingBrowseFilters({
        date: 'next_month',
        timeOfDay: 'midnight',
        priceRange: 'vip',
        proType: 'unknown',
      }),
    ).toEqual({
      date: 'today',
      timeOfDay: 'flexible',
      priceRange: 'all',
      proType: 'all',
    });
  });
});

describe('estimateMarketplaceSignals', () => {
  it('is deterministic for a given pro id', () => {
    const first = estimateMarketplaceSignals('pro-abc-1');
    const second = estimateMarketplaceSignals('pro-abc-1');
    expect(first).toEqual(second);
  });

  it('returns realistic marketplace values', () => {
    const data = estimateMarketplaceSignals('pro-xyz-9');
    expect(data.hourlyRateZar).toBeGreaterThanOrEqual(350);
    expect(data.hourlyRateZar).toBeLessThanOrEqual(1600);
    expect(data.reviewCount).toBeGreaterThanOrEqual(12);
    expect(data.completedTasks).toBeGreaterThanOrEqual(25);
    expect(data.workPhotoCount).toBeGreaterThanOrEqual(3);
  });
});

describe('matchesBookingBrowseFilters', () => {
  const lowPrice = {
    hourlyRateZar: 450,
    reviewCount: 60,
    completedTasks: 120,
    workPhotoCount: 7,
    isElite: false,
  };

  const highPriceElite = {
    hourlyRateZar: 1300,
    reviewCount: 340,
    completedTasks: 980,
    workPhotoCount: 22,
    isElite: true,
  };

  it('matches all when no restrictive filters are applied', () => {
    const filters: BookingBrowseFilters = {
      date: 'today',
      timeOfDay: 'flexible',
      priceRange: 'all',
      proType: 'all',
    };

    expect(matchesBookingBrowseFilters(lowPrice, filters)).toBe(true);
    expect(matchesBookingBrowseFilters(highPriceElite, filters)).toBe(true);
  });

  it('filters by budget and elite selections', () => {
    const budgetElite: BookingBrowseFilters = {
      date: 'today',
      timeOfDay: 'morning',
      priceRange: 'budget',
      proType: 'elite',
    };

    expect(matchesBookingBrowseFilters(lowPrice, budgetElite)).toBe(false);
    expect(matchesBookingBrowseFilters(highPriceElite, budgetElite)).toBe(false);

    const premiumElite: BookingBrowseFilters = {
      date: 'within_week',
      timeOfDay: 'evening',
      priceRange: 'premium',
      proType: 'elite',
    };

    expect(matchesBookingBrowseFilters(highPriceElite, premiumElite)).toBe(true);
    expect(matchesBookingBrowseFilters(lowPrice, premiumElite)).toBe(false);
  });
});

describe('formatZar', () => {
  it('formats as ZAR currency', () => {
    expect(formatZar(987)).toContain('987');
  });
});
