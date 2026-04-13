import { describe, expect, it } from 'vitest';
import { getBookingActionsForViewer, assertBookingTransitionAllowed } from './booking-permissions';

describe('getBookingActionsForViewer', () => {
  it('pro accepts or declines when pending', () => {
    const a = getBookingActionsForViewer('pending', 'pro');
    expect(a.map((x) => x.nextStatus).sort()).toEqual(['cancelled', 'confirmed']);
  });

  it('customer can only cancel when pending', () => {
    const a = getBookingActionsForViewer('pending', 'consumer');
    expect(a.map((x) => x.nextStatus)).toEqual(['cancelled']);
  });

  it('pro completes from in_progress only', () => {
    const a = getBookingActionsForViewer('in_progress', 'pro');
    expect(a.map((x) => x.nextStatus)).toEqual(['completed']);
  });

  it('customer has no actions in_progress', () => {
    expect(getBookingActionsForViewer('in_progress', 'consumer')).toEqual([]);
  });
});

describe('assertBookingTransitionAllowed', () => {
  it('throws when consumer tries to confirm', () => {
    expect(() => assertBookingTransitionAllowed('consumer', 'pending', 'confirmed')).toThrow();
  });

  it('allows pro to confirm', () => {
    expect(() => assertBookingTransitionAllowed('pro', 'pending', 'confirmed')).not.toThrow();
  });
});
