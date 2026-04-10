'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BookingStatus } from '@/lib/types';

type NextAction = {
  status: BookingStatus;
  label: string;
  tone: 'primary' | 'neutral' | 'danger';
};

const actionMap: Record<BookingStatus, NextAction[]> = {
  pending: [
    { status: 'confirmed', label: 'Confirm booking', tone: 'primary' },
    { status: 'cancelled', label: 'Cancel booking', tone: 'danger' },
  ],
  confirmed: [
    { status: 'in_progress', label: 'Start job', tone: 'primary' },
    { status: 'cancelled', label: 'Cancel booking', tone: 'danger' },
  ],
  in_progress: [
    { status: 'completed', label: 'Mark complete', tone: 'primary' },
    { status: 'cancelled', label: 'Cancel booking', tone: 'danger' },
  ],
  completed: [],
  cancelled: [],
};

const toneClasses: Record<NextAction['tone'], string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-sky-500',
  neutral: 'border border-slate-700 text-slate-200 hover:border-slate-500',
  danger: 'border border-rose-900/70 bg-rose-500/10 text-rose-200 hover:border-rose-500/70 hover:bg-rose-500/15',
};

export function BookingStatusActions({ bookingId, currentStatus }: { bookingId: string; currentStatus: BookingStatus }) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const actions = useMemo(() => actionMap[currentStatus] ?? [], [currentStatus]);

  async function updateStatus(status: BookingStatus) {
    setPendingStatus(status);
    setMessage(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });

      const payload = (await response.json()) as { booking?: { status: BookingStatus }; error?: string };
      if (!response.ok || !payload.booking) {
        throw new Error(payload.error ?? 'Unable to update booking');
      }

      setMessage(`Status updated to ${payload.booking.status.replace('_', ' ')}.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update booking');
    } finally {
      setPendingStatus(null);
    }
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Update status</h2>
          <p className="mt-1 text-sm text-slate-400">Keep the job lifecycle in sync.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            onClick={() => updateStatus(action.status)}
            disabled={pendingStatus !== null}
            className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition duration-[var(--motion-base)] disabled:cursor-not-allowed disabled:opacity-60 ${
              action.tone === 'primary'
                ? toneClasses.primary
                : action.tone === 'danger'
                  ? toneClasses.danger
                  : toneClasses.neutral
            }`}
          >
            {pendingStatus === action.status ? 'Updating...' : action.label}
          </button>
        ))}
      </div>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
