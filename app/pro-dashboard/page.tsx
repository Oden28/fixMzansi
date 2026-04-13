import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { getProDashboardData } from '@/lib/dashboard';
import { requireProWorkspace } from '@/lib/auth-guard';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export default async function ProDashboardPage() {
  const session = await requireProWorkspace();
  const dashboard = await getProDashboardData(session.userId).catch(() => null);

  const supabase = getSupabaseServerClient();
  const { data: proRow } = await supabase.from('pros').select('id').eq('user_id', session.userId).maybeSingle();
  let pendingBookingCount = 0;
  if (proRow) {
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('pro_id', proRow.id)
      .eq('status', 'pending');
    pendingBookingCount = count ?? 0;
  }

  const kpis = dashboard
    ? [
        { label: 'Open leads', value: String(dashboard.openLeadCount), helper: 'Needs response' },
        { label: 'Bookings', value: String(dashboard.bookingCount), helper: 'Scheduled work' },
        { label: 'Completed jobs', value: String(dashboard.completedCount), helper: 'Earned revenue' },
        { label: 'Average rating', value: dashboard.averageRating.toFixed(1), helper: 'Trust signal' },
      ]
    : [
        { label: 'Open leads', value: '0', helper: 'Needs response' },
        { label: 'Bookings', value: '0', helper: 'Scheduled work' },
        { label: 'Completed jobs', value: '0', helper: 'Earned revenue' },
        { label: 'Average rating', value: '0.0', helper: 'Trust signal' },
      ];

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <DashboardShell
          title="Pro dashboard"
          description="Leads, bookings, and reputation — tied to your verified pro profile."
          ctaHref="/pros"
          ctaLabel="View directory"
        >
          <KpiGrid cards={kpis} />

          {pendingBookingCount > 0 ? (
            <div className="mt-8 rounded-[24px] border border-amber-500/30 bg-amber-950/20 px-6 py-5">
              <p className="text-sm font-semibold text-amber-200">
                {pendingBookingCount} booking{pendingBookingCount === 1 ? '' : 's'} need your response
              </p>
              <p className="mt-2 text-sm text-amber-100/80">
                Accept or decline so the customer knows whether you are taking the job.
              </p>
              <Link
                href="/bookings"
                className="mt-4 inline-flex touch-target items-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-400"
              >
                Open bookings →
              </Link>
            </div>
          ) : null}

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold text-white">Lead inbox</h2>
              {dashboard?.latestLead ? (
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-white">Latest lead:</span> {dashboard.latestLead.category}
                  </p>
                  <p>
                    <span className="text-white">Suburb:</span> {dashboard.latestLead.suburb}
                  </p>
                  <p>
                    <span className="text-white">Status:</span> {dashboard.latestLead.status}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-300">No open leads yet. Keep your profile verified to stay competitive.</p>
              )}
            </article>
            <article className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold text-white">Reputation summary</h2>
              <p className="mt-2 text-sm text-slate-300">Monitor verification, reviews, and completion history in one place.</p>
              {dashboard ? (
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-white">Pro name:</span> {dashboard.proName}
                  </p>
                  <p>
                    <span className="text-white">Completed:</span> {dashboard.completedCount}
                  </p>
                </div>
              ) : null}
            </article>
          </section>
        </DashboardShell>
      </Container>
    </main>
  );
}
