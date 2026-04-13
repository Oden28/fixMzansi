import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { BookingStatusActions } from '@/components/booking/BookingStatusActions';
import { BookingLifecycleTimeline } from '@/components/booking/BookingLifecycleTimeline';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getServerSession } from '@/lib/server-session';
import type { BookingViewer } from '@/lib/booking-permissions';

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/bookings/${id}`)}`);
  }

  const supabase = getSupabaseServerClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, request_id, pro_id, scheduled_time, status, payment_status, created_at')
    .eq('id', id)
    .single();

  if (!booking) {
    notFound();
  }

  const { data: request } = await supabase
    .from('service_requests')
    .select('id, user_id, category, suburb, description, urgency, status')
    .eq('id', booking.request_id)
    .single();

  const { data: pro } = await supabase
    .from('pros')
    .select('id, user_id, trade_category, city, verification_status, rating, response_time_minutes, summary')
    .eq('id', booking.pro_id)
    .single();

  const { data: proUser } = pro
    ? await supabase.from('users').select('id, full_name, email').eq('id', pro.user_id).maybeSingle()
    : { data: null };

  const { data: customerUser } = request
    ? await supabase.from('users').select('id, full_name, email').eq('id', request.user_id).maybeSingle()
    : { data: null };

  const isCustomer = session.role === 'consumer' && request?.user_id === session.userId;
  const isPro = session.role === 'pro' && pro?.user_id === session.userId;
  const isAdmin = session.role === 'admin';

  if (!isCustomer && !isPro && !isAdmin) {
    notFound();
  }

  let viewer: BookingViewer = 'guest';
  if (isAdmin) viewer = 'admin';
  else if (isPro) viewer = 'pro';
  else if (isCustomer) viewer = 'consumer';

  const timelineMode = viewer === 'pro' ? 'pro' : viewer === 'consumer' ? 'customer' : 'neutral';
  const canReview = booking.status === 'completed' && isCustomer;

  const scheduled = booking.scheduled_time ? new Date(booking.scheduled_time).toLocaleString() : null;

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <Link href="/bookings" className="text-emerald-400 transition hover:text-emerald-300">
              ← All bookings
            </Link>
            {request ? (
              <Link href={`/requests/${request.id}`} className="text-slate-500 transition hover:text-slate-300">
                View request
              </Link>
            ) : null}
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-sky-400/90">Booking</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            {request ? `${request.category} in ${request.suburb}` : 'Booking details'}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            {viewer === 'consumer' && 'Track your job and talk with your pro through notifications.'}
            {viewer === 'pro' && 'Accept, schedule work, and complete the job so the customer can review you.'}
            {viewer === 'admin' && 'Operational view of this booking.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium capitalize text-sky-300">
              {booking.status.replace('_', ' ')}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
              {booking.payment_status.replace('_', ' ')}
            </span>
            {scheduled ? (
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                Scheduled: {scheduled}
              </span>
            ) : null}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
                <h2 className="text-lg font-semibold text-white">Progress</h2>
                <div className="mt-6">
                  <BookingLifecycleTimeline currentStatus={booking.status} mode={timelineMode} />
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-3">
              <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                <h2 className="text-lg font-semibold text-white">People & job</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</p>
                    <p className="mt-2 text-white">{customerUser?.full_name ?? 'Customer'}</p>
                    {viewer === 'pro' || viewer === 'admin' ? (
                      <p className="mt-1 text-xs text-slate-500">{customerUser?.email ?? ''}</p>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pro</p>
                    <p className="mt-2 text-white">{proUser?.full_name ?? 'Solar pro'}</p>
                    {viewer === 'customer' || viewer === 'admin' ? (
                      <p className="mt-1 text-xs text-slate-500">{proUser?.email ?? ''}</p>
                    ) : null}
                  </div>
                </div>
                {request ? (
                  <div className="mt-6 border-t border-slate-800 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job brief</p>
                    <p className="mt-2 leading-relaxed text-slate-300">{request.description}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Urgency: <span className="text-slate-400">{request.urgency}</span>
                    </p>
                  </div>
                ) : null}
                {pro ? (
                  <div className="mt-4">
                    <Link
                      href={`/pros/${pro.id}`}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      View pro profile →
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
                <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} viewerRole={viewer} />
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                {canReview ? (
                  <ReviewForm bookingId={booking.id} proId={booking.pro_id} />
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Review</h3>
                    <p className="mt-3 text-slate-400">
                      {booking.status === 'completed'
                        ? isPro
                          ? 'The customer can leave a review for this completed job.'
                          : 'Sign in as the customer who booked this job to leave a review.'
                        : 'Reviews unlock after the pro marks the job complete.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
