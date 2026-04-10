import { describe, expect, it } from 'vitest';
import { deriveRequestStatusAfterMatching } from './lifecycle';

describe('deriveRequestStatusAfterMatching', () => {
  it('keeps request submitted when no matches are found', () => {
    expect(deriveRequestStatusAfterMatching(0)).toBe('submitted');
  });

  it('sets request to matched when at least one match exists', () => {
    expect(deriveRequestStatusAfterMatching(1)).toBe('matched');
    expect(deriveRequestStatusAfterMatching(5)).toBe('matched');
  });

  it('treats negative counts as zero to avoid invalid transitions', () => {
    expect(deriveRequestStatusAfterMatching(-3)).toBe('submitted');
  });
});
