import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { queueNotification } from '@/lib/notifications';
import { getApiSession, isValidUUID } from '@/lib/api-auth';
import { assertBookingTransitionAllowed, type BookingViewer } from '@/lib/booking-permissions';
import { serviceRequestStatusForBooking } from '@/lib/booking-request-status';
import type { BookingStatus } from '@/lib/types';

const bookingStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const satisfies readonly BookingStatus[];

function sessionToBookingViewer(
  session: { role: string; sub: string },
  isRequestOwner: boolean,
  isProOwner: boolean,
): BookingViewer {
  if (session.role === 'admin') return 'admin';
  if (isProOwner) return 'pro';
  if (isRequestOwner) return 'consumer';
  return 'guest';
}

export async function POST(request: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { requestId?: string; proId?: string; scheduledTime?: string };

    if (!body.requestId || !body.proId) {
      return NextResponse.json({ error: 'requestId and proId are required' }, { status: 400 });
    }

    if (!isValidUUID(body.requestId) || !isValidUUID(body.proId)) {
      return NextResponse.json({ error: 'Invalid requestId or proId format' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data: requestRow, error: requestLookupError } = await supabase
      .from('service_requests')
      .select('id, user_id, status')
      .eq('id', body.requestId)
      .single();

    if (requestLookupError || !requestRow) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (session.role !== 'admin' && requestRow.user_id !== session.sub) {
      return NextResponse.json({ error: 'You can only book your own requests' }, { status: 403 });
    }

    if (['completed', 'cancelled'].includes(requestRow.status)) {
      return NextResponse.json({ error: 'Cannot book a completed or cancelled request' }, { status: 400 });
    }

    const { data: activeBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('request_id', body.requestId)
      .in('status', ['pending', 'confirmed', 'in_progress'])
      .maybeSingle();

    if (activeBooking) {
      return NextResponse.json(
        { error: 'This request already has an active booking. Cancel it first or open the existing booking.' },
        { status: 409 },
      );
    }

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

    const { data: proRow, error: proLookupError } = await supabase
      .from('pros')
      .select('id, user_id')
      .eq('id', body.proId)
      .single();
    if (proLookupError || !proRow) throw proLookupError ?? new Error('Failed to load pro user');

    const { error: requestStatusError } = await supabase
      .from('service_requests')
      .update({ status: serviceRequestStatusForBooking('pending') })
      .eq('id', body.requestId);
    if (requestStatusError) throw requestStatusError;

    await Promise.all([
      queueNotification(supabase, {
        userId: requestRow.user_id,
        channel: 'in_app',
        type: 'booking_pending',
        payload: {
          requestId: body.requestId,
          proId: body.proId,
          bookingId: data.id,
          message: 'You requested this pro. They will accept or decline soon.',
        },
      }),
      queueNotification(supabase, {
        userId: proRow.user_id,
        channel: 'in_app',
        type: 'booking_needs_response',
        payload: {
          requestId: body.requestId,
          proId: body.proId,
          bookingId: data.id,
          message: 'New booking request — accept or decline.',
        },
      }),
    ]);

    return NextResponse.json({ booking: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    console.error('[bookings] POST error:', message);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { bookingId?: string; status?: BookingStatus };

    if (!body.bookingId || !body.status) {
      return NextResponse.json({ error: 'bookingId and status are required' }, { status: 400 });
    }

    if (!isValidUUID(body.bookingId)) {
      return NextResponse.json({ error: 'Invalid bookingId format' }, { status: 400 });
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

    const [{ data: requestRow }, { data: proRow }] = await Promise.all([
      supabase.from('service_requests').select('user_id').eq('id', booking.request_id).single(),
      supabase.from('pros').select('user_id').eq('id', booking.pro_id).single(),
    ]);

    const isRequestOwner = requestRow?.user_id === session.sub;
    const isProOwner = proRow?.user_id === session.sub;

    if (session.role !== 'admin' && !isRequestOwner && !isProOwner) {
      return NextResponse.json({ error: 'Not authorized to update this booking' }, { status: 403 });
    }

    const viewer = sessionToBookingViewer(session, isRequestOwner, isProOwner);

    try {
      assertBookingTransitionAllowed(viewer, booking.status as BookingStatus, body.status);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transition not allowed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data: updatedBooking, error: bookingUpdateError } = await supabase
      .from('bookings')
      .update({ status: body.status })
      .eq('id', body.bookingId)
      .select('id, request_id, pro_id, status, payment_status, scheduled_time')
      .single();

    if (bookingUpdateError || !updatedBooking) throw bookingUpdateError ?? new Error('Failed to update booking');

    const nextRequestStatus = serviceRequestStatusForBooking(body.status);
    const { error: requestUpdateError } = await supabase
      .from('service_requests')
      .update({ status: nextRequestStatus })
      .eq('id', booking.request_id);
    if (requestUpdateError) throw requestUpdateError;

    const [{ data: requestRowFull, error: requestLookupError }, { data: proRowFull, error: proLookupError }] = await Promise.all([
      supabase.from('service_requests').select('id, user_id').eq('id', booking.request_id).single(),
      supabase.from('pros').select('id, user_id').eq('id', booking.pro_id).single(),
    ]);

    if (requestLookupError || !requestRowFull) throw requestLookupError ?? new Error('Failed to load request user');
    if (proLookupError || !proRowFull) throw proLookupError ?? new Error('Failed to load pro user');

    const cancelledBy =
      body.status === 'cancelled'
        ? viewer === 'consumer'
          ? 'customer'
          : viewer === 'pro'
            ? 'pro'
            : 'admin'
        : null;

    const notifPayload = {
      bookingId: booking.id,
      requestId: booking.request_id,
      proId: booking.pro_id,
      previousStatus: booking.status,
      status: body.status,
      ...(cancelledBy ? { cancelledBy } : {}),
    };

    const customerCopy =
      body.status === 'confirmed'
        ? 'Your pro accepted the booking.'
        : body.status === 'in_progress'
          ? 'Work has started on your booking.'
          : body.status === 'completed'
            ? 'Your job is marked complete. Please leave a review.'
            : body.status === 'cancelled'
              ? cancelledBy === 'pro'
                ? 'The pro declined or withdrew. Your request is open again to book someone else.'
                : cancelledBy === 'customer'
                  ? 'You cancelled this booking. You can book another pro from your request.'
                  : 'This booking was cancelled.'
              : 'Booking updated.';

    const proCopy =
      body.status === 'confirmed'
        ? 'You accepted the booking.'
        : body.status === 'in_progress'
          ? 'Job marked in progress.'
          : body.status === 'completed'
            ? 'Job marked complete. The customer can review you.'
            : body.status === 'cancelled'
              ? cancelledBy === 'customer'
                ? 'The customer cancelled this booking.'
                : 'Booking cancelled.'
              : 'Booking updated.';

    await Promise.all([
      queueNotification(supabase, {
        userId: requestRowFull.user_id,
        channel: 'in_app',
        type: 'booking_update_customer',
        payload: { ...notifPayload, message: customerCopy },
      }),
      queueNotification(supabase, {
        userId: proRowFull.user_id,
        channel: 'in_app',
        type: 'booking_update_pro',
        payload: { ...notifPayload, message: proCopy },
      }),
    ]);

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update booking';
    console.error('[bookings] PATCH error:', message);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
