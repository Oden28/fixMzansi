import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export default async function BookingsPage() {
  const supabase = getSupabaseServerClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, request_id, pro_id, status, payment_status, scheduled_time, created_at')
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Bookings</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Booking workspace</h1>
          <p className="mt-3 text-slate-300">
            Track job progress, payment state, and the latest booking activity across the marketplace.
          </p>
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent bookings</h2>
              <p className="mt-1 text-sm text-slate-400">Newest bookings from Supabase.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {(bookings ?? []).map((booking) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`} className="rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 transition hover:border-sky-500/50 hover:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white">Booking {booking.id}</p>
                    <p className="mt-1 text-slate-400">Request {booking.request_id} · Pro {booking.pro_id}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">{booking.status}</span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">{booking.payment_status}</span>
                  </div>
                </div>
              </Link>
            ))}
            {(bookings ?? []).length === 0 ? (
              <p className="text-sm text-slate-400">No bookings yet. Create a request and book a pro to populate this workspace.</p>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
