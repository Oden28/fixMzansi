import { Container } from '@/components/layout/Container';
import { NotificationsCenter } from '@/components/notifications/NotificationsCenter';
import { requireSignedIn } from '@/lib/auth-guard';

export default async function NotificationsPage() {
  await requireSignedIn();

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="mb-8 max-w-3xl rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Live inbox</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Notification center</h1>
          <p className="mt-3 text-slate-300">
            Filter by unread or queued items and keep track of marketplace activity in one place.
          </p>
        </div>
        <NotificationsCenter />
      </Container>
    </main>
  );
}
