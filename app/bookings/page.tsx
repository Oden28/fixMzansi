import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getServerSession } from '@/lib/server-session';

export default async function BookingsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent('/bookings')}`);
  }

  const supabase = getSupabaseServerClient();

  type BookingRow = {
    id: string;
    request_id: string;
    pro_id: string;
    status: string;
    payment_status: string;
    scheduled_time: string | null;
    created_at: string;
  };

  let bookings: BookingRow[] = [];
  let listTitle = 'Your bookings';
  let listSubtitle = '';

  if (session.role === 'admin') {
    const { data } = await supabase
      .from('bookings')
      .select('id, request_id, pro_id, status, payment_status, scheduled_time, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    bookings = (data ?? []) as BookingRow[];
    listTitle = 'All bookings';
    listSubtitle = 'Marketplace-wide (admin)';
  } else if (session.role === 'pro') {
    const { data: pro } = await supabase.from('pros').select('id').eq('user_id', session.userId).maybeSingle();
    if (pro) {
      const { data } = await supabase
        .from('bookings')
        .select('id, request_id, pro_id, status, payment_status, scheduled_time, created_at')
        .eq('pro_id', pro.id)
        .order('created_at', { ascending: false })
        .limit(50);
      bookings = (data ?? []) as BookingRow[];
    }
    listTitle = 'Your jobs';
    listSubtitle = 'Bookings where you are the assigned pro — accept, run the job, then mark complete.';
  } else {
    const { data: myRequests } = await supabase.from('service_requests').select('id').eq('user_id', session.userId);
    const ids = (myRequests ?? []).map((r) => r.id);
    if (ids.length > 0) {
      const { data } = await supabase
        .from('bookings')
        .select('id, request_id, pro_id, status, payment_status, scheduled_time, created_at')
        .in('request_id', ids)
        .order('created_at', { ascending: false })
        .limit(50);
      bookings = (data ?? []) as BookingRow[];
    }
    listTitle = 'Your bookings';
    listSubtitle = 'Jobs you booked with a pro. Open one to see status and next steps.';
  }

  const requestIds = [...new Set(bookings.map((b) => b.request_id))];
  const proIds = [...new Set(bookings.map((b) => b.pro_id))];

  const { data: requests } =
    requestIds.length > 0
      ? await supabase.from('service_requests').select('id, category, suburb').in('id', requestIds)
      : { data: [] as { id: string; category: string; suburb: string }[] };

  const { data: pros } =
    proIds.length > 0
      ? await supabase.from('pros').select('id, user_id').in('id', proIds)
      : { data: [] as { id: string; user_id: string }[] };

  const userIds = [...new Set((pros ?? []).map((p) => p.user_id))];
  const { data: users } =
    userIds.length > 0
      ? await supabase.from('users').select('id, full_name').in('id', userIds)
      : { data: [] as { id: string; full_name: string }[] };

  const requestById = new Map((requests ?? []).map((r) => [r.id, r]));
  const proById = new Map((pros ?? []).map((p) => [p.id, p]));
  const userById = new Map((users ?? []).map((u) => [u.id, u]));

  const needsAttention = (b: BookingRow) => b.status === 'pending' || b.status === 'confirmed';

  const sorted = [...bookings].sort((a, b) => {
    const aU = needsAttention(a) ? 0 : 1;
    const bU = needsAttention(b) ? 0 : 1;
    if (aU !== bU) return aU - bU;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400/90">Bookings</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{listTitle}</h1>
          <p className="mt-3 text-slate-400">{listSubtitle}</p>
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
          <div className="grid gap-3">
            {sorted.map((booking) => {
              const req = requestById.get(booking.request_id);
              const pro = proById.get(booking.pro_id);
              const proName = pro ? (userById.get(pro.user_id)?.full_name ?? 'Pro') : 'Pro';
              const title = req ? `${req.category} · ${req.suburb}` : `Booking ${booking.id.slice(0, 8)}…`;
              const attention = needsAttention(booking);

              return (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-4 text-sm text-slate-300 transition hover:border-emerald-600/40 hover:bg-slate-900/50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {session.role === 'consumer' ? `With ${proName}` : null}
                        {session.role === 'pro' ? 'Your assigned job' : null}
                        {session.role === 'admin' ? `Request ${booking.request_id.slice(0, 8)}…` : null}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {attention ? (
                        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                          Needs action
                        </span>
                      ) : null}
                      <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-medium capitalize text-sky-300">
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {sorted.length === 0 ? (
              <p className="text-sm text-slate-400">
                {session.role === 'consumer'
                  ? 'No bookings yet. Create a request, pick a matched pro, then book.'
                  : session.role === 'pro'
                    ? 'No bookings yet. When a customer books you, it will appear here for you to accept.'
                    : 'No bookings in the system.'}
              </p>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
