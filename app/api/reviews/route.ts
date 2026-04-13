import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { queueNotification } from '@/lib/notifications';
import { getApiSession, isValidUUID } from '@/lib/api-auth';

export async function POST(request: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { bookingId?: string; proId?: string; rating?: number; text?: string };

    if (!body.bookingId || !body.proId || !body.rating) {
      return NextResponse.json({ error: 'bookingId, proId, and rating are required' }, { status: 400 });
    }

    if (!isValidUUID(body.bookingId) || !isValidUUID(body.proId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5 || !Number.isInteger(body.rating)) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    const reviewText = typeof body.text === 'string' ? body.text.trim().slice(0, 2000) : '';

    const supabase = getSupabaseServerClient();

    const { data: booking } = await supabase
      .from('bookings')
      .select('id, request_id, status')
      .eq('id', body.bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'completed') {
      return NextResponse.json({ error: 'Reviews can only be submitted after completion' }, { status: 400 });
    }

    const { data: requestRow } = await supabase
      .from('service_requests')
      .select('id, user_id')
      .eq('id', booking.request_id)
      .single();

    if (!requestRow) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Only the request owner can leave a review
    if (requestRow.user_id !== session.sub && session.role !== 'admin') {
      return NextResponse.json({ error: 'Only the customer who made the request can leave a review' }, { status: 403 });
    }

    // Check for duplicate review
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', body.bookingId)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json({ error: 'A review already exists for this booking' }, { status: 409 });
    }

    const { error } = await supabase.from('reviews').insert({
      booking_id: body.bookingId,
      user_id: requestRow.user_id,
      pro_id: body.proId,
      rating: body.rating,
      text: reviewText,
      verified: false,
    });

    if (error) throw error;

    // Notify the pro about the new review
    const { data: proRow } = await supabase.from('pros').select('user_id').eq('id', body.proId).maybeSingle();

    await Promise.all([
      queueNotification(supabase, {
        userId: requestRow.user_id,
        channel: 'in_app',
        type: 'review_submitted',
        payload: { bookingId: body.bookingId, proId: body.proId },
      }),
      proRow
        ? queueNotification(supabase, {
            userId: proRow.user_id,
            channel: 'in_app',
            type: 'new_review',
            payload: { bookingId: body.bookingId, rating: body.rating },
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit review';
    console.error('[reviews] POST error:', message);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
