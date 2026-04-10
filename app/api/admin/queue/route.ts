import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import type { AdminDashboardPayload, AdminQueueItem } from '@/lib/admin';

function formatTime(value: string | null) {
  return value ?? new Date().toISOString();
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const [
      pendingPros,
      pendingRequests,
      pendingReviews,
      queuedNotifications,
      openRequestsCount,
      pendingProsCount,
      activeBookingsCount,
      verifiedProsCount,
      pendingReviewsCount,
      queuedNotificationsCount,
    ] = await Promise.all([
      supabase
        .from('pros')
        .select('id, user_id, trade_category, city, verification_status, summary, created_at')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('service_requests')
        .select('id, category, suburb, status, urgency, created_at')
        .in('status', ['submitted', 'matched'])
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('reviews')
        .select('id, booking_id, rating, verified, created_at, text')
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('notifications')
        .select('id, user_id, channel, type, status, created_at')
        .eq('status', 'queued')
        .order('created_at', { ascending: false })
        .limit(8),
      supabase.from('service_requests').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'matched']),
      supabase.from('pros').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).in('status', ['pending', 'confirmed', 'in_progress']),
      supabase.from('pros').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('verified', false),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('status', 'queued'),
    ]);

    const queue: AdminQueueItem[] = [
      ...(pendingRequests.data ?? []).map((row) => ({
        id: row.id,
        type: 'request' as const,
        title: `${row.category} request in ${row.suburb}`,
        status: row.status,
        createdAt: formatTime(row.created_at),
        description: `Urgency: ${row.urgency}`,
        meta: ['Live request', row.status],
      })),
      ...(pendingPros.data ?? []).map((row) => ({
        id: row.id,
        type: 'pro' as const,
        title: `${row.trade_category} pro awaiting verification`,
        status: row.verification_status,
        createdAt: formatTime(row.created_at),
        description: row.summary ?? row.city ?? 'New pro profile',
        meta: [row.city ?? 'Cape Town', 'Verification queue'],
      })),
      ...(pendingReviews.data ?? []).map((row) => ({
        id: row.id,
        type: 'review' as const,
        title: `Review for booking ${row.booking_id}`,
        status: row.verified ? 'approved' : 'pending',
        createdAt: formatTime(row.created_at),
        description: row.text ?? `Rating: ${row.rating}/5`,
        meta: ['Review moderation'],
      })),
      ...(queuedNotifications.data ?? []).map((row) => ({
        id: row.id,
        type: 'notification' as const,
        title: `${row.type} via ${row.channel}`,
        status: row.status,
        createdAt: formatTime(row.created_at),
        description: `Queued for user ${row.user_id}`,
        meta: ['Notification queue'],
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const payload: AdminDashboardPayload = {
      kpis: [
        { label: 'Open requests', value: String(openRequestsCount.count ?? 0), delta: 'Live' },
        { label: 'Pending pros', value: String(pendingProsCount.count ?? 0), delta: 'Needs review' },
        { label: 'Active bookings', value: String(activeBookingsCount.count ?? 0), delta: 'In motion' },
        { label: 'Verified pros', value: String(verifiedProsCount.count ?? 0), delta: 'Trusted pool' },
        { label: 'Pending reviews', value: String(pendingReviewsCount.count ?? 0), delta: 'Moderation' },
        { label: 'Queued notifications', value: String(queuedNotificationsCount.count ?? 0), delta: 'Delivery' },
      ],
      queue,
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load operations queue';
    return NextResponse.json({ error: message, kpis: [], queue: [] }, { status: 500 });
  }
}
