import type { BookingStatus } from '@/lib/types';

export type BookingViewer = 'consumer' | 'pro' | 'admin' | 'guest';

export type BookingAction = {
  nextStatus: BookingStatus;
  label: string;
  description: string;
  tone: 'primary' | 'neutral' | 'danger';
};

/**
 * Who may move the booking to `nextStatus` from `current`.
 * - Pro drives acceptance → work → completion.
 * - Customer can cancel while not in progress (withdraw booking).
 * - Admin can override.
 */
export function getBookingActionsForViewer(current: BookingStatus, viewer: BookingViewer): BookingAction[] {
  if (viewer === 'guest' || current === 'completed' || current === 'cancelled') {
    return [];
  }

  if (viewer === 'admin') {
    return adminActions(current);
  }

  if (viewer === 'pro') {
    if (current === 'pending') {
      return [
        {
          nextStatus: 'confirmed',
          label: 'Accept booking',
          description: 'Confirm you will take this job. The customer is notified immediately.',
          tone: 'primary',
        },
        {
          nextStatus: 'cancelled',
          label: 'Decline',
          description: 'Turn this job down. The request goes back to matched so the customer can pick someone else.',
          tone: 'danger',
        },
      ];
    }
    if (current === 'confirmed') {
      return [
        {
          nextStatus: 'in_progress',
          label: 'Start job',
          description: 'Use this when you are on site or work has begun.',
          tone: 'primary',
        },
        {
          nextStatus: 'cancelled',
          label: 'Withdraw',
          description: 'Cancel before starting. The customer can book another pro.',
          tone: 'danger',
        },
      ];
    }
    if (current === 'in_progress') {
      return [
        {
          nextStatus: 'completed',
          label: 'Mark complete',
          description: 'Finish the job so the customer can leave a review.',
          tone: 'primary',
        },
      ];
    }
    return [];
  }

  // consumer
  if (current === 'pending' || current === 'confirmed') {
    return [
      {
        nextStatus: 'cancelled',
        label: 'Cancel booking',
        description: 'Withdraw this booking. You can choose another pro from your matched list.',
        tone: 'danger',
      },
    ];
  }
  return [];
}

function adminActions(current: BookingStatus): BookingAction[] {
  const map: Record<BookingStatus, BookingAction[]> = {
    pending: [
      { nextStatus: 'confirmed', label: 'Set confirmed', description: '', tone: 'primary' },
      { nextStatus: 'cancelled', label: 'Set cancelled', description: '', tone: 'danger' },
    ],
    confirmed: [
      { nextStatus: 'in_progress', label: 'Set in progress', description: '', tone: 'primary' },
      { nextStatus: 'cancelled', label: 'Set cancelled', description: '', tone: 'danger' },
    ],
    in_progress: [
      { nextStatus: 'completed', label: 'Set completed', description: '', tone: 'primary' },
      { nextStatus: 'cancelled', label: 'Set cancelled', description: '', tone: 'danger' },
    ],
    completed: [],
    cancelled: [],
  };
  return map[current] ?? [];
}

export function assertBookingTransitionAllowed(
  viewer: BookingViewer,
  current: BookingStatus,
  next: BookingStatus,
): void {
  const allowed = getBookingActionsForViewer(current, viewer).some((a) => a.nextStatus === next);
  if (!allowed) {
    throw new Error('This action is not available for your role or the current booking stage.');
  }
}
