'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { TaskFlowSteps } from '@/components/booking/TaskFlowSteps';
import { buildScopedPath } from '@/lib/identity-scope';
import { estimateMarketplaceSignals, formatZar } from '@/lib/booking-funnel';

function asValue(value: string | null) {
  return value && value.trim().length > 0 ? value.trim() : '';
}

export default function BookingConfirmPage() {
  const router = useRouter();
  const params = useSearchParams();

  const requestId = asValue(params.get('requestId'));
  const proId = asValue(params.get('proId'));
  const date = asValue(params.get('date'));
  const time = asValue(params.get('time'));
  const customerUserId = asValue(params.get('customerUserId'));
  const proUserId = asValue(params.get('proUserId'));

  const scope = {
    ...(customerUserId ? { customerUserId } : {}),
    ...(proUserId ? { proUserId } : {}),
  };

  const signals = useMemo(() => estimateMarketplaceSignals(proId || 'default-pro'), [proId]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!requestId || !proId) {
    return (
      <main className="min-h-screen bg-slate-950 py-10 text-slate-100 md:py-14">
        <Container>
          <p className="text-slate-300">Missing booking details. Return to your request and choose a pro.</p>
        </Container>
      </main>
    );
  }

  const oneHourDeposit = signals.hourlyRateZar;
  const trustFee = Math.round(signals.hourlyRateZar * 0.12);
  const totalRate = signals.hourlyRateZar + trustFee;

  async function confirmBooking() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ requestId, proId }),
      });

      const payload = (await response.json()) as { booking?: { id: string }; error?: string };
      if (!response.ok || !payload.booking) {
        throw new Error(payload.error ?? 'Booking failed');
      }

      const next = buildScopedPath(`/bookings/${payload.booking.id}`, scope);
      router.push(next);
      router.refresh();
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Booking failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100 md:py-14">
      <Container>
        <div className="space-y-8">
          <TaskFlowSteps current={4} scope={scope} requestId={requestId} />

          <section className="rounded-2xl border border-slate-800 bg-[var(--color-surface)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">4: Confirm details</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Review your booking summary</h1>
            <p className="mt-3 text-sm text-slate-300">
              Once you confirm, we place a 1-hour refundable deposit. You can cancel at least 24 hours before the appointment for a full refund.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
                <h2 className="font-semibold text-white">Task summary</h2>
                <ul className="mt-3 space-y-2 text-slate-300">
                  <li>Request: {requestId.slice(0, 8)}…</li>
                  <li>Selected pro: {proId.slice(0, 8)}…</li>
                  <li>Date preference: {date || 'Today / earliest'}</li>
                  <li>Start time: {time || 'Flexible'}</li>
                </ul>
                <p className="mt-4 text-xs text-slate-500">
                  You can chat with your pro after booking to refine task details and timing.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
                <h2 className="font-semibold text-white">Price details</h2>
                <div className="mt-3 space-y-2 text-slate-300">
                  <p className="flex items-center justify-between">
                    <span>Hourly rate</span>
                    <span>{formatZar(signals.hourlyRateZar)}/hr</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Trust & support fee</span>
                    <span>{formatZar(trustFee)}/hr</span>
                  </p>
                  <p className="flex items-center justify-between border-t border-slate-800 pt-2 font-semibold text-white">
                    <span>Total rate</span>
                    <span>{formatZar(totalRate)}/hr</span>
                  </p>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Deposit charged now: {formatZar(oneHourDeposit)} for 1 hour. Remaining balance is charged when the task is complete.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={buildScopedPath(`/bookings/schedule?requestId=${requestId}&proId=${proId}`, scope)}
                className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                Back
              </Link>
              <button
                type="button"
                onClick={() => void confirmBooking()}
                disabled={pending}
                className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? 'Confirming...' : 'Confirm and book'}
              </button>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </section>
        </div>
      </Container>
    </main>
  );
}
