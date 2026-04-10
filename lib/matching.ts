import type { ProProfile, ServiceRequest } from './types';

export function scoreProMatch(pro: ProProfile, request: ServiceRequest): number {
  let score = 0;

  if (pro.tradeCategory === request.category) score += 50;
  if (pro.verificationStatus === 'verified') score += 20;
  if (pro.suburb.toLowerCase() === request.suburb.toLowerCase()) score += 15;
  score += Math.max(0, 10 - pro.responseTimeMinutes / 10);
  score += Math.min(pro.rating * 2, 10);

  return score;
}

export function matchPros(request: ServiceRequest, pros: ProProfile[]): Array<ProProfile & { score: number }> {
  return [...pros]
    .map((pro) => ({ ...pro, score: scoreProMatch(pro, request) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
