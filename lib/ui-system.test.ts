import { describe, expect, it } from 'vitest';
import { designTokens } from './design-tokens';
import { getMotionPreset, getComponentClasses } from './ui-system';

describe('getMotionPreset', () => {
  it('maps interaction classes to expected timing windows', () => {
    expect(getMotionPreset('micro').durationMs).toBe(150);
    expect(getMotionPreset('small').durationMs).toBe(220);
    expect(getMotionPreset('medium').durationMs).toBe(300);
  });
});

describe('getComponentClasses', () => {
  it('returns consistent class contracts for inputs and buttons', () => {
    const input = getComponentClasses('input');
    const button = getComponentClasses('button');

    expect(input).toContain('touch-target');
    expect(input).toContain('rounded-xl');

    expect(button).toContain('touch-target');
    expect(button).toContain('rounded-xl');
  });

  it('keeps durations aligned with token system', () => {
    const select = getComponentClasses('select');
    expect(select).toContain(`duration-[${designTokens.motion.fast}]`);
  });

  it('uses card radius token for card components', () => {
    const card = getComponentClasses('card');
    expect(card).toContain(`rounded-[${designTokens.radius.card}]`);
  });
});
