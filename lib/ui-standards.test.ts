import { describe, expect, it } from 'vitest';
import { designTokens } from './design-tokens';

describe('design tokens', () => {
  it('uses marketplace trust palette from UI/UX baseline', () => {
    expect(designTokens.colors.primary).toBe('#0B6E4F');
    expect(designTokens.colors.action).toBe('#F59E0B');
  });

  it('keeps motion within recommended micro-interaction range', () => {
    const msValues = [designTokens.motion.fast, designTokens.motion.base, designTokens.motion.slow].map((value) =>
      Number(value.replace('ms', '')),
    );

    expect(msValues.every((value) => value >= 150 && value <= 300)).toBe(true);
  });

  it('enforces touch-safe target and spacing baseline', () => {
    expect(designTokens.touch.minTargetPx).toBeGreaterThanOrEqual(44);
    expect(designTokens.touch.minGapPx).toBeGreaterThanOrEqual(8);
  });
});
