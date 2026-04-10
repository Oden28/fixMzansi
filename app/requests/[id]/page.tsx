import { Container } from '@/components/layout/Container';
import { BookProButton } from '@/components/booking/BookProButton';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import type { RequestStatus } from '@/lib/types';
import { extractIdentityScopeFromRecord, buildScopedPath } from '@/lib/identity-scope';
import Link from 'next/link';

const statusChips: RequestStatus[] = ['submitted', 'matched', 'booked', 'completed', 'cancelled'];

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const scope = extractIdentityScopeFromRecord((await searchParams) ?? {});
  const supabase = getSupabaseServerClient();

  let requestQuery = supabase
    .from('service_requests')
    .select('id, user_id, category, suburb, description, urgency, status, created_at')
    .eq('id', id);

  if (scope.customerUserId) {
    requestQuery = requestQuery.eq('user_id', scope.customerUserId);
  }

  const { data: request } = await requestQuery.single();

  const { data: matches } = await supabase
    .from('matches')
    .select('id, request_id, pro_id, rank_score, match_reason, created_at')
    .eq('request_id', id)
    .order('rank_score', { ascending: false });

  const { data: proRows } = await supabase
    .from('pros')
    .select('id, user_id, trade_category, city, suburb_service_area, verification_status, rating, response_time_minutes, summary, profile_photo_url')
    .in('id', (matches ?? []).map((match) => match.pro_id));

  const { data: userRows } = await supabase
    .from('users')
    .select('id, full_name')
    .in('id', (proRows ?? []).map((pro) => pro.user_id));

  const { data: bookingRows } = await supabase
    .from('bookings')
    .select('id, pro_id, status, scheduled_time, payment_status, created_at')
    .eq('request_id', id)
    .order('created_at', { ascending: false });

  const proById = new Map((proRows ?? []).map((pro) => [pro.id, pro]));
  const userById = new Map((userRows ?? []).map((user) => [user.id, user.full_name]));
  const bookingByProId = new Map((bookingRows ?? []).map((booking) => [booking.pro_id, booking]));
  const requestHasBooking = (bookingRows ?? []).length > 0;

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Request details</p>
          <h1 className="text-3xl font-semibold">Request ID: {id}</h1>
        </div>

        {request ? (
          <div className="mt-6 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
            <div className="flex flex-wrap gap-2">
              {statusChips.map((chip) => (
                <span
                  key={chip}
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${request.status === chip ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <p><span className="text-white">Category:</span> {request.category}</p>
              <p><span className="text-white">Suburb:</span> {request.suburb}</p>
              <p><span className="text-white">Urgency:</span> {request.urgency}</p>
            </div>
            <p className="mt-4 leading-6">{request.description}</p>
            {requestHasBooking ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-200">
                This request has already been booked. The booking details are below.
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-slate-300">This request was not found yet.</p>
        )}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Matched pros</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Choose a verified provider</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {(matches ?? []).length > 0 ? (
              (matches ?? []).map((match, index) => {
                const pro = proById.get(match.pro_id);
                if (!pro) return null;
                const proName = userById.get(pro.user_id) ?? pro.user_id;
                const booking = bookingByProId.get(pro.id);
                return (
                  <article key={match.id} className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{proName}</h3>
                        <p className="mt-1 text-sm text-slate-400">{pro.city} · {pro.trade_category}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                        {pro.verification_status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">{pro.summary}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                      <span>Score: {match.rank_score}</span>
                      <span>Rank #{index + 1}</span>
                    </div>
                    {booking ? (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                        <p><span className="text-white">Booking:</span> {booking.status}</p>
                        <p><span className="text-white">Payment:</span> {booking.payment_status}</p>
                      </div>
                    ) : null}
                    {!requestHasBooking ? (
                      <div className="mt-5 flex gap-3">
                        <Link href={buildScopedPath(`/pros/${pro.id}`, scope)} className="inline-cta rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
                          View profile
                        </Link>
                        <BookProButton requestId={id} proId={pro.id} customerUserId={scope.customerUserId} />
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <p className="text-slate-400">No live matches yet. Run matching after a new request is submitted.</p>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
