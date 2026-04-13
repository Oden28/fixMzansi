import type { BookingStatus } from '@/lib/types';

const steps: Array<{ status: BookingStatus; title: string; customerHint: string; proHint: string }> = [
  {
    status: 'pending',
    title: 'Awaiting pro',
    customerHint: 'The pro has been asked to accept or decline.',
    proHint: 'Accept to confirm the job, or decline to release the customer.',
  },
  {
    status: 'confirmed',
    title: 'Confirmed',
    customerHint: 'Your pro has accepted. They will start when ready.',
    proHint: 'Start the job when you are on site or work begins.',
  },
  {
    status: 'in_progress',
    title: 'In progress',
    customerHint: 'Work is underway.',
    proHint: 'Mark complete when the job is finished.',
  },
  {
    status: 'completed',
    title: 'Completed',
    customerHint: 'Leave a review to help other homeowners.',
    proHint: 'Great work — the customer can review you now.',
  },
];

export function BookingLifecycleTimeline({
  currentStatus,
  mode,
}: {
  currentStatus: BookingStatus;
  mode: 'customer' | 'pro' | 'neutral';
}) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4 text-sm text-rose-100">
        <p className="font-semibold text-rose-200">Booking cancelled</p>
        <p className="mt-2 text-rose-100/90">
          This job did not go ahead. If you are the customer, open your request again to choose another pro when the
          request is matched.
        </p>
      </div>
    );
  }

  const activeIndex = steps.findIndex((s) => s.status === currentStatus);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const done = index < resolvedIndex;
        const current = index === resolvedIndex;
        const hint =
          mode === 'pro' ? step.proHint : mode === 'customer' ? step.customerHint : `${step.customerHint} ${step.proHint}`;

        return (
          <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
            {index < steps.length - 1 ? (
              <div
                className={`absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-px ${done || current ? 'bg-emerald-600/50' : 'bg-slate-800'}`}
                aria-hidden
              />
            ) : null}
            <div
              className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? 'bg-emerald-500 text-white'
                  : current
                    ? 'bg-sky-500 text-white ring-2 ring-sky-400/50'
                    : 'border border-slate-700 bg-slate-900 text-slate-500'
              }`}
            >
              {done ? '✓' : index + 1}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className={`font-semibold ${current ? 'text-white' : done ? 'text-emerald-200' : 'text-slate-500'}`}>
                {step.title}
              </p>
              {(current || done) && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
