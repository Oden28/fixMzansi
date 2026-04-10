import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { queueNotification } from '@/lib/notifications';
import type { BookingStatus } from '@/lib/types';

const bookingStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const satisfies readonly BookingStatus[];
const requestStatusByBookingStatus: Partial<Record<BookingStatus, 'booked' | 'completed' | 'cancelled'>> = {
  confirmed: 'booked',
  in_progress: 'booked',
  completed: 'completed',
  cancelled: 'cancelled',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { requestId?: string; proId?: string; scheduledTime?: string; customerUserId?: string };

    if (!body.requestId || !body.proId) {
      return NextResponse.json({ error: 'requestId and proId are required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        request_id: body.requestId,
        pro_id: body.proId,
        scheduled_time: body.scheduledTime ?? null,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select('id, request_id, pro_id, status')
      .single();

    if (error || !data) throw error ?? new Error('Failed to create booking');

    const { data: requestRow, error: requestLookupError } = await supabase
      .from('service_requests')
      .select('id, user_id')
      .eq('id', body.requestId)
      .single();
    if (requestLookupError || !requestRow) throw requestLookupError ?? new Error('Failed to load request user');

    if (body.customerUserId && requestRow.user_id !== body.customerUserId) {
      return NextResponse.json({ error: 'Request does not belong to customer scope' }, { status: 403 });
    }

    const { data: proRow, error: proLookupError } = await supabase
      .from('pros')
      .select('id, user_id')
      .eq('id', body.proId)
      .single();
    if (proLookupError || !proRow) throw proLookupError ?? new Error('Failed to load pro user');

    const { error: requestStatusError } = await supabase
      .from('service_requests')
      .update({ status: 'booked' })
      .eq('id', body.requestId);
    if (requestStatusError) throw requestStatusError;

    await Promise.all([
      queueNotification(supabase, {
        userId: requestRow.user_id,
        channel: 'in_app',
        type: 'booking_created',
        payload: { requestId: body.requestId, proId: body.proId, bookingId: data.id },
      }),
      queueNotification(supabase, {
        userId: proRow.user_id,
        channel: 'in_app',
        type: 'new_booking',
        payload: { requestId: body.requestId, proId: body.proId, bookingId: data.id },
      }),
    ]);

    return NextResponse.json({ booking: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; status?: BookingStatus };

    if (!body.bookingId || !body.status) {
      return NextResponse.json({ error: 'bookingId and status are required' }, { status: 400 });
    }

    if (!bookingStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data: booking, error: bookingLookupError } = await supabase
      .from('bookings')
      .select('id, request_id, pro_id, status, payment_status, scheduled_time')
      .eq('id', body.bookingId)
      .single();

    if (bookingLookupError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === body.status) {
      return NextResponse.json({ booking });
    }

    const { data: updatedBooking, error: bookingUpdateError } = await supabase
      .from('bookings')
      .update({ status: body.status })
      .eq('id', body.bookingId)
      .select('id, request_id, pro_id, status, payment_status, scheduled_time')
      .single();

    if (bookingUpdateError || !updatedBooking) throw bookingUpdateError ?? new Error('Failed to update booking');

    const requestStatus = requestStatusByBookingStatus[body.status];
    if (requestStatus) {
      const { error: requestUpdateError } = await supabase
        .from('service_requests')
        .update({ status: requestStatus })
        .eq('id', booking.request_id);
      if (requestUpdateError) throw requestUpdateError;
    }

    const [{ data: requestRow, error: requestLookupError }, { data: proRow, error: proLookupError }] = await Promise.all([
      supabase.from('service_requests').select('id, user_id').eq('id', booking.request_id).single(),
      supabase.from('pros').select('id, user_id').eq('id', booking.pro_id).single(),
    ]);

    if (requestLookupError || !requestRow) throw requestLookupError ?? new Error('Failed to load request user');
    if (proLookupError || !proRow) throw proLookupError ?? new Error('Failed to load pro user');

    await Promise.all([
      queueNotification(supabase, {
        userId: requestRow.user_id,
        channel: 'in_app',
        type: 'booking_status_updated',
        payload: {
          bookingId: booking.id,
          requestId: booking.request_id,
          proId: booking.pro_id,
          previousStatus: booking.status,
          status: body.status,
        },
      }),
      queueNotification(supabase, {
        userId: proRow.user_id,
        channel: 'in_app',
        type: 'booking_status_updated',
        payload: {
          bookingId: booking.id,
          requestId: booking.request_id,
          proId: booking.pro_id,
          previousStatus: booking.status,
          status: body.status,
        },
      }),
    ]);

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
