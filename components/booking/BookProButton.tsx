'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildScopedPath } from '@/lib/identity-scope';

export function BookProButton({
  requestId,
  proId,
  customerUserId,
}: {
  requestId: string;
  proId: string;
  customerUserId?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, proId, customerUserId }),
      });

      const payload = (await response.json()) as { booking?: { id: string }; error?: string };

      if (!response.ok || !payload.booking) {
        throw new Error(payload.error ?? 'Booking failed');
      }

      const scopedPath = buildScopedPath(`/bookings/${payload.booking.id}`, {
        customerUserId,
      });
      router.push(scopedPath);
      router.refresh();
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Booking failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="touch-target rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Booking...' : 'Book this pro'}
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
