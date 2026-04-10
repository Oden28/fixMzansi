import { Container } from '@/components/layout/Container';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { getCustomerDashboardData } from '@/lib/dashboard';
import { requireCustomerWorkspace } from '@/lib/auth-guard';

export default async function DashboardPage() {
  const session = await requireCustomerWorkspace();
  const dashboard = await getCustomerDashboardData(session.userId).catch(() => null);

  const kpis = dashboard
    ? [
        { label: 'Requests', value: String(dashboard.requestCount), helper: 'Total by customer' },
        { label: 'Active bookings', value: String(dashboard.activeBookingCount), helper: 'In progress' },
        { label: 'Unread notifications', value: String(dashboard.unreadNotificationCount), helper: 'Needs attention' },
        {
          label: 'Latest request',
          value: dashboard.latestRequest ? dashboard.latestRequest.status : 'None',
          helper: dashboard.latestRequest ? dashboard.latestRequest.category : 'Start a request',
        },
      ]
    : [
        { label: 'Requests', value: '0', helper: 'Total by customer' },
        { label: 'Active bookings', value: '0', helper: 'In progress' },
        { label: 'Unread notifications', value: '0', helper: 'Needs attention' },
        { label: 'Latest request', value: 'None', helper: 'Start a request' },
      ];

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <DashboardShell
          title="Marketplace dashboard"
          description="Your requests, bookings, and notifications — scoped to your FixMzansi account."
          ctaHref="/requests"
          ctaLabel="Create request"
        >
          <KpiGrid cards={kpis} />

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold text-white">Request timeline</h2>
              {dashboard?.latestRequest ? (
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-white">Current status:</span> {dashboard.latestRequest.status}
                  </p>
                  <p>
                    <span className="text-white">Suburb:</span> {dashboard.latestRequest.suburb}
                  </p>
                  <p>
                    <span className="text-white">Urgency:</span> {dashboard.latestRequest.urgency}
                  </p>
                  <p>
                    <span className="text-white">Created:</span> {new Date(dashboard.latestRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-300">No requests yet. Create your first solar request to get matched.</p>
              )}
            </article>
            <article className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
              <h2 className="text-lg font-semibold text-white">Recommended next action</h2>
              <p className="mt-2 text-sm text-slate-300">Review your matched providers and book the one that fits best.</p>
              {dashboard?.latestBooking ? (
                <div className="mt-4 text-sm text-slate-300">
                  <p>
                    <span className="text-white">Latest booking:</span> {dashboard.latestBooking.status}
                  </p>
                  <p>
                    <span className="text-white">Payment:</span> {dashboard.latestBooking.paymentStatus}
                  </p>
                </div>
              ) : null}
            </article>
          </section>

          <section className="mt-8 rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent requests</h2>
                <p className="mt-1 text-sm text-slate-400">Your latest request history from Supabase.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {(dashboard?.recentRequests ?? []).map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-sm text-slate-300"
                >
                  <div>
                    <span className="text-white">{request.category}</span> · {request.suburb}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{request.status}</span>
                    <span className="text-slate-500">{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {(dashboard?.recentRequests ?? []).length === 0 ? <p className="text-sm text-slate-400">No recent requests yet.</p> : null}
            </div>
          </section>
        </DashboardShell>
      </Container>
    </main>
  );
}
