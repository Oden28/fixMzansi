import Link from 'next/link';
import { buildScopedPath, type IdentityScope } from '@/lib/identity-scope';

type StepId = 1 | 2 | 3 | 4;

const steps: Array<{ id: StepId; title: string; hint: string; href?: string }> = [
  { id: 1, title: 'Describe task', hint: 'Location + details', href: '/requests' },
  { id: 2, title: 'Browse pros & prices', hint: 'Compare trusted matches' },
  { id: 3, title: 'Choose date & time', hint: 'Pick availability' },
  { id: 4, title: 'Confirm details', hint: 'Review + book' },
];

export function TaskFlowSteps({
  current,
  scope,
  requestId,
}: {
  current: StepId;
  scope: IdentityScope;
  requestId?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[var(--color-surface)]/90 p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Booking flow</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map((step) => {
          const isDone = step.id < current;
          const isActive = step.id === current;
          const href =
            step.href ??
            (step.id === 2 && requestId ? `/requests/${requestId}` : undefined);

          const content = (
            <div
              className={`rounded-[var(--radius-control)] border px-3 py-3 transition duration-[var(--motion-fast)] ease-[var(--ease-out)] ${
                isActive
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : isDone
                    ? 'border-slate-700 bg-slate-900/60'
                    : 'border-slate-800 bg-slate-950/40'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isActive ? 'text-emerald-300' : 'text-slate-500'}`}>
                Step {step.id}
              </p>
              <p className={`mt-1 text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>{step.title}</p>
              <p className="mt-1 text-xs text-slate-400">{step.hint}</p>
            </div>
          );

          if (href && (isDone || isActive)) {
            return (
              <Link key={step.id} href={buildScopedPath(href, scope)} className="block">
                {content}
              </Link>
            );
          }

          return <div key={step.id}>{content}</div>;
        })}
      </div>
    </section>
  );
}
