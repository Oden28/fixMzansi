import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { TaskFlowSteps } from '@/components/booking/TaskFlowSteps';
import { buildScopedPath, extractIdentityScopeFromRecord } from '@/lib/identity-scope';

const slots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

export default async function BookingSchedulePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = (await searchParams) ?? {};
  const scope = extractIdentityScopeFromRecord(query);
  const requestId = typeof query.requestId === 'string' ? query.requestId : '';
  const proId = typeof query.proId === 'string' ? query.proId : '';
  const date = typeof query.date === 'string' ? query.date : '';
  const time = typeof query.time === 'string' ? query.time : '';

  if (!requestId || !proId) {
    redirect(buildScopedPath('/requests', scope));
  }

  const continuePath = buildScopedPath(
    `/bookings/confirm?requestId=${requestId}&proId=${proId}${date ? `&date=${date}` : ''}${time ? `&time=${time}` : ''}`,
    scope,
  );

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100 md:py-14">
      <Container>
        <div className="space-y-8">
          <TaskFlowSteps current={3} scope={scope} requestId={requestId} />

          <section className="rounded-2xl border border-slate-800 bg-[var(--color-surface)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">3: Choose date & time</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Pick your preferred appointment slot</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Choose the closest available date and a convenient start window. You can chat with your pro to adjust details after booking.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Date options</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {['today', 'tomorrow', 'within_3_days', 'within_week'].map((value) => (
                    <Link
                      key={value}
                      href={buildScopedPath(`/bookings/schedule?requestId=${requestId}&proId=${proId}&date=${value}${time ? `&time=${time}` : ''}`, scope)}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        date === value
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {value.replaceAll('_', ' ')}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Calendar</p>
                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <span key={d} className="py-1">{d}</span>
                  ))}
                  {Array.from({ length: 28 }).map((_, idx) => {
                    const day = idx + 1;
                    const active = (date === 'today' && day === 1) || (date === 'within_3_days' && day <= 3);
                    return (
                      <span
                        key={day}
                        className={`rounded-md py-1 ${active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-900/50 text-slate-500'}`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Start time</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {slots.map((slot) => (
                    <Link
                      key={slot}
                      href={buildScopedPath(`/bookings/schedule?requestId=${requestId}&proId=${proId}${date ? `&date=${date}` : ''}&time=${slot}`, scope)}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition ${
                        time === slot
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {slot}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={buildScopedPath(`/requests/${requestId}`, scope)}
                className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                Back to pros
              </Link>
              <Link
                href={continuePath}
                className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Continue to confirm
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
