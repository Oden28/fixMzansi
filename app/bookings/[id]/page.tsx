import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { BookingStatusActions } from '@/components/booking/BookingStatusActions';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, request_id, pro_id, scheduled_time, status, payment_status, created_at')
    .eq('id', id)
    .single();

  const { data: request } = booking
    ? await supabase
        .from('service_requests')
        .select('id, user_id, category, suburb, description, urgency, status')
        .eq('id', booking.request_id)
        .single()
    : { data: null };

  const { data: pro } = booking
    ? await supabase
        .from('pros')
        .select('id, user_id, trade_category, city, verification_status, rating, response_time_minutes, summary')
        .eq('id', booking.pro_id)
        .single()
    : { data: null };

  const { data: proUser } = pro
    ? await supabase.from('users').select('id, full_name').eq('id', pro.user_id).maybeSingle()
    : { data: null };

  const canReview = booking?.status === 'completed';

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Booking details</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Booking ID: {id}</h1>
          <p className="mt-3 text-slate-300">A clear view of the booking lifecycle and the associated request and provider.</p>

          {booking ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                  <h2 className="text-lg font-semibold text-white">Request</h2>
                  {request ? (
                    <>
                      <p className="mt-3"><span className="text-slate-400">Category</span><br />{request.category}</p>
                      <p className="mt-4"><span className="text-slate-400">Suburb</span><br />{request.suburb}</p>
                      <p className="mt-4"><span className="text-slate-400">Urgency</span><br />{request.urgency}</p>
                      <p className="mt-4"><span className="text-slate-400">Status</span><br /><span className="text-white">{request.status}</span></p>
                    </>
                  ) : (
                    <p className="mt-3 text-slate-400">Request details unavailable.</p>
                  )}
                </div>
                <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                  <h2 className="text-lg font-semibold text-white">Provider</h2>
                  {pro ? (
                    <>
                      <p className="mt-3"><span className="text-slate-400">Name</span><br />{proUser?.full_name ?? pro.user_id}</p>
                      <p className="mt-4"><span className="text-slate-400">Trade</span><br />{pro.trade_category}</p>
                      <p className="mt-4"><span className="text-slate-400">Verification</span><br />{pro.verification_status}</p>
                      <p className="mt-4"><span className="text-slate-400">Rating</span><br />{pro.rating}</p>
                    </>
                  ) : (
                    <p className="mt-3 text-slate-400">Provider details unavailable.</p>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">{booking.status}</span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">{booking.payment_status}</span>
                </div>
                <p className="mt-4 text-slate-400">Booking status controls and history</p>
                <div className="mt-4">
                  <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
                {canReview ? (
                  <ReviewForm bookingId={booking.id} proId={booking.pro_id} />
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Leave a review</h3>
                    <p className="mt-3 text-slate-300">Reviews become available once the booking is marked completed.</p>
                    <Link href={`/requests/${booking.request_id}`} className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500">
                      Return to request
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="mt-3 text-slate-300">This booking was not found yet.</p>
          )}
        </div>
      </Container>
    </main>
  );
}
