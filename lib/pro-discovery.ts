import type { ProProfile, TradeCategory } from './types';

type CategoryFilter = TradeCategory | 'all';

export function getDiscoveryCategories(pros: ProProfile[]): CategoryFilter[] {
  const categories = new Set<TradeCategory>(pros.map((pro) => pro.tradeCategory));
  return ['all', ...Array.from(categories).sort()];
}

export function filterPros({
  pros,
  category,
  query,
}: {
  pros: ProProfile[];
  category: CategoryFilter;
  query: string;
}): ProProfile[] {
  const normalizedQuery = query.trim().toLowerCase();

  return pros.filter((pro) => {
    if (category !== 'all' && pro.tradeCategory !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchText = `${pro.name} ${pro.suburb} ${pro.summary}`.toLowerCase();
    return searchText.includes(normalizedQuery);
  });
}
