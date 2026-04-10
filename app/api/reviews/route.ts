import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { queueNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; proId?: string; rating?: number; text?: string };

    if (!body.bookingId || !body.proId || !body.rating) {
      return NextResponse.json({ error: 'bookingId, proId, and rating are required' }, { status: 400 });
    }

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

    const { error } = await supabase.from('reviews').insert({
      booking_id: body.bookingId,
      user_id: requestRow.user_id,
      pro_id: body.proId,
      rating: body.rating,
      text: body.text ?? '',
      verified: false,
    });

    if (error) throw error;

    await queueNotification(supabase, {
      userId: requestRow.user_id,
      channel: 'in_app',
      type: 'review_submitted',
      payload: { bookingId: body.bookingId, proId: body.proId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit review';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
