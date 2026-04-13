'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BookingStatus } from '@/lib/types';
import { getBookingActionsForViewer, type BookingViewer } from '@/lib/booking-permissions';

const toneClasses = {
  primary: 'bg-[var(--color-primary)] text-white hover:brightness-110',
  neutral: 'border border-slate-700 text-slate-200 hover:border-slate-500',
  danger: 'border border-rose-900/70 bg-rose-500/10 text-rose-200 hover:border-rose-500/70 hover:bg-rose-500/15',
} as const;

export function BookingStatusActions({
  bookingId,
  currentStatus,
  viewerRole,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
  viewerRole: BookingViewer;
}) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const actions = useMemo(
    () => getBookingActionsForViewer(currentStatus, viewerRole),
    [currentStatus, viewerRole],
  );

  async function updateStatus(status: BookingStatus) {
    setPendingStatus(status);
    setMessage(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId, status }),
      });

      const payload = (await response.json()) as { booking?: { status: BookingStatus }; error?: string };
      if (!response.ok || !payload.booking) {
        throw new Error(payload.error ?? 'Unable to update booking');
      }

      setMessage(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update booking');
    } finally {
      setPendingStatus(null);
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        {viewerRole === 'guest'
          ? 'Sign in as the customer or assigned pro to manage this booking.'
          : currentStatus === 'completed'
            ? 'This job is complete. The customer can leave a review.'
            : currentStatus === 'cancelled'
              ? 'This booking was cancelled.'
              : 'No actions are available for you at this stage.'}
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Next steps</h3>
      <ul className="mt-4 space-y-4">
        {actions.map((action) => (
          <li key={action.nextStatus} className="rounded-2xl border border-slate-800/80 bg-slate-950/30 p-4">
            <p className="font-medium text-white">{action.label}</p>
            {action.description ? <p className="mt-1 text-sm text-slate-400">{action.description}</p> : null}
            <button
              type="button"
              onClick={() => updateStatus(action.nextStatus)}
              disabled={pendingStatus !== null}
              className={`mt-3 touch-target rounded-full px-4 py-2.5 text-sm font-medium transition duration-[var(--motion-base)] disabled:cursor-not-allowed disabled:opacity-60 ${
                toneClasses[action.tone]
              }`}
            >
              {pendingStatus === action.nextStatus ? 'Updating…' : action.label}
            </button>
          </li>
        ))}
      </ul>
      {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
    </div>
  );
}
