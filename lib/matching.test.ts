import { describe, expect, it } from 'vitest';
import { matchPros } from './matching';
import { samplePros, sampleRequest } from './seed-data';

describe('matchPros', () => {
  it('returns verified matching solar pros first', () => {
    const results = matchPros(sampleRequest, samplePros);
    expect(results[0]?.name).toBe('SolarWorks Cape');
    expect(results[1]?.tradeCategory).toBe('solar');
  });
});
