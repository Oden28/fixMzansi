export type BookingBrowseDateFilter = 'today' | 'within_3_days' | 'within_week' | 'choose_dates';
export type BookingBrowseTimeFilter = 'morning' | 'afternoon' | 'evening' | 'specific_time' | 'flexible';
export type BookingBrowsePriceFilter = 'all' | 'budget' | 'standard' | 'premium';
export type BookingBrowseProTypeFilter = 'all' | 'elite';

export type BookingBrowseFilters = {
  date: BookingBrowseDateFilter;
  timeOfDay: BookingBrowseTimeFilter;
  priceRange: BookingBrowsePriceFilter;
  proType: BookingBrowseProTypeFilter;
};

export type MarketplaceSignals = {
  hourlyRateZar: number;
  reviewCount: number;
  completedTasks: number;
  workPhotoCount: number;
  isElite: boolean;
};

const DEFAULT_FILTERS: BookingBrowseFilters = {
  date: 'today',
  timeOfDay: 'flexible',
  priceRange: 'all',
  proType: 'all',
};

const dateFilters = new Set<BookingBrowseDateFilter>(['today', 'within_3_days', 'within_week', 'choose_dates']);
const timeFilters = new Set<BookingBrowseTimeFilter>(['morning', 'afternoon', 'evening', 'specific_time', 'flexible']);
const priceFilters = new Set<BookingBrowsePriceFilter>(['all', 'budget', 'standard', 'premium']);
const proTypeFilters = new Set<BookingBrowseProTypeFilter>(['all', 'elite']);

function asString(value: unknown): string | undefined {
  if (Array.isArray(value)) return asString(value[0]);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function parseBookingBrowseFilters(source: Record<string, unknown>): BookingBrowseFilters {
  const date = asString(source.date);
  const timeOfDay = asString(source.timeOfDay);
  const priceRange = asString(source.priceRange);
  const proType = asString(source.proType);

  return {
    date: date && dateFilters.has(date as BookingBrowseDateFilter) ? (date as BookingBrowseDateFilter) : DEFAULT_FILTERS.date,
    timeOfDay:
      timeOfDay && timeFilters.has(timeOfDay as BookingBrowseTimeFilter)
        ? (timeOfDay as BookingBrowseTimeFilter)
        : DEFAULT_FILTERS.timeOfDay,
    priceRange:
      priceRange && priceFilters.has(priceRange as BookingBrowsePriceFilter)
        ? (priceRange as BookingBrowsePriceFilter)
        : DEFAULT_FILTERS.priceRange,
    proType:
      proType && proTypeFilters.has(proType as BookingBrowseProTypeFilter)
        ? (proType as BookingBrowseProTypeFilter)
        : DEFAULT_FILTERS.proType,
  };
}

export function estimateMarketplaceSignals(proId: string): MarketplaceSignals {
  const hash = hashString(proId);

  const hourlyRateZar = 350 + (hash % 1251);
  const reviewCount = 12 + (hash % 420);
  const completedTasks = 25 + (hash % 1600);
  const workPhotoCount = 3 + (hash % 30);
  const isElite = reviewCount >= 180 || completedTasks >= 500;

  return {
    hourlyRateZar,
    reviewCount,
    completedTasks,
    workPhotoCount,
    isElite,
  };
}

function passesPriceFilter(hourlyRateZar: number, priceRange: BookingBrowsePriceFilter): boolean {
  if (priceRange === 'all') return true;
  if (priceRange === 'budget') return hourlyRateZar <= 700;
  if (priceRange === 'standard') return hourlyRateZar > 700 && hourlyRateZar <= 1000;
  return hourlyRateZar > 1000;
}

export function matchesBookingBrowseFilters(signals: MarketplaceSignals, filters: BookingBrowseFilters): boolean {
  if (!passesPriceFilter(signals.hourlyRateZar, filters.priceRange)) {
    return false;
  }

  if (filters.proType === 'elite' && !signals.isElite) {
    return false;
  }

  return true;
}

export function formatZar(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}
