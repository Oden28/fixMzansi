import { Container } from '@/components/layout/Container';
import { BookProButton } from '@/components/booking/BookProButton';
import { TaskFlowSteps } from '@/components/booking/TaskFlowSteps';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import type { RequestStatus } from '@/lib/types';
import { extractIdentityScopeFromRecord, buildScopedPath } from '@/lib/identity-scope';
import Link from 'next/link';
import {
  estimateMarketplaceSignals,
  formatZar,
  matchesBookingBrowseFilters,
  parseBookingBrowseFilters,
} from '@/lib/booking-funnel';

const statusChips: RequestStatus[] = ['submitted', 'matched', 'booked', 'completed', 'cancelled'];

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const scope = extractIdentityScopeFromRecord(query);
  const filters = parseBookingBrowseFilters(query);

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

  const rawCards = (matches ?? []).map((match, index) => {
    const pro = proById.get(match.pro_id);
    if (!pro) return null;

    const signals = estimateMarketplaceSignals(pro.id);
    const booking = bookingByProId.get(pro.id);

    return {
      key: match.id,
      rank: index + 1,
      pro,
      proName: userById.get(pro.user_id) ?? pro.user_id,
      signals,
      booking,
      score: match.rank_score,
    };
  });

  const cards = rawCards.filter((card): card is NonNullable<typeof card> => Boolean(card));
  const filteredCards = cards.filter((card) => matchesBookingBrowseFilters(card.signals, filters));

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100 md:py-14">
      <Container>
        <div className="space-y-8">
          <TaskFlowSteps current={2} scope={scope} requestId={id} />

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">2: Browse pros & prices</p>
            <h1 className="text-3xl font-semibold">Matched pros for request {id.slice(0, 8)}…</h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Compare verified providers by price, reviews, and response speed. Then select a pro and continue to scheduling.
            </p>
          </div>

          {request ? (
            <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
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
                <p>
                  <span className="text-white">Category:</span> {request.category}
                </p>
                <p>
                  <span className="text-white">Suburb:</span> {request.suburb}
                </p>
                <p>
                  <span className="text-white">Urgency:</span> {request.urgency}
                </p>
              </div>
              <p className="mt-4 leading-6">{request.description}</p>
              {requestHasBooking ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-200">
                  This request already has a booking. Open the booking to manage next steps.
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-slate-300">This request was not found yet.</p>
          )}

          <section className="rounded-[var(--radius-card)] border border-slate-800 bg-[var(--color-surface)] p-4 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter & sort</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterLink label="Date: Today" href={withFilters(id, scope, { ...filters, date: 'today' })} active={filters.date === 'today'} />
              <FilterLink
                label="Date: Within 3 days"
                href={withFilters(id, scope, { ...filters, date: 'within_3_days' })}
                active={filters.date === 'within_3_days'}
              />
              <FilterLink
                label="Time: Morning"
                href={withFilters(id, scope, { ...filters, timeOfDay: 'morning' })}
                active={filters.timeOfDay === 'morning'}
              />
              <FilterLink
                label="Time: Flexible"
                href={withFilters(id, scope, { ...filters, timeOfDay: 'flexible' })}
                active={filters.timeOfDay === 'flexible'}
              />
              <FilterLink
                label="Price: Budget"
                href={withFilters(id, scope, { ...filters, priceRange: 'budget' })}
                active={filters.priceRange === 'budget'}
              />
              <FilterLink
                label="Price: Standard"
                href={withFilters(id, scope, { ...filters, priceRange: 'standard' })}
                active={filters.priceRange === 'standard'}
              />
              <FilterLink
                label="Price: Premium"
                href={withFilters(id, scope, { ...filters, priceRange: 'premium' })}
                active={filters.priceRange === 'premium'}
              />
              <FilterLink
                label="Pro type: Elite"
                href={withFilters(id, scope, { ...filters, proType: 'elite' })}
                active={filters.proType === 'elite'}
              />
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <article key={card.key} className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{card.proName}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {card.pro.city} · {card.pro.trade_category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                        {card.pro.verification_status}
                      </span>
                      <p className="mt-2 text-lg font-semibold text-white">{formatZar(card.signals.hourlyRateZar)}/hr</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">{card.pro.summary}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>⭐ {Number(card.pro.rating).toFixed(1)} ({card.signals.reviewCount} reviews)</span>
                    <span>•</span>
                    <span>{card.signals.completedTasks} tasks overall</span>
                    <span>•</span>
                    <span>{card.signals.workPhotoCount} work photos</span>
                    <span>•</span>
                    <span>{card.pro.response_time_minutes} min avg response</span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-sm text-slate-400">
                    <span>Match score: {card.score}</span>
                    <span>Rank #{card.rank}</span>
                  </div>

                  {card.booking ? (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
                      <p>
                        <span className="text-white">Booking:</span> {card.booking.status}
                      </p>
                      <p>
                        <span className="text-white">Payment:</span> {card.booking.payment_status}
                      </p>
                    </div>
                  ) : null}

                  {!requestHasBooking ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={buildScopedPath(`/pros/${card.pro.id}`, scope)}
                        className="inline-cta rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
                      >
                        View profile
                      </Link>
                      <BookProButton requestId={id} proId={card.pro.id} customerUserId={scope.customerUserId} />
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-slate-400">No pros match the active filters yet. Try widening date, time, or price filters.</p>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

function withFilters(
  requestId: string,
  scope: { customerUserId?: string; proUserId?: string },
  filters: { date: string; timeOfDay: string; priceRange: string; proType: string },
) {
  const path = `/requests/${requestId}?date=${filters.date}&timeOfDay=${filters.timeOfDay}&priceRange=${filters.priceRange}&proType=${filters.proType}`;
  return buildScopedPath(path, scope);
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
        active
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {label}
    </Link>
  );
}
