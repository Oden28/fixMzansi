import { getSupabaseServerClient } from './supabase-server';

export type CustomerDashboardSummary = {
  customerName: string;
  requestCount: number;
  activeBookingCount: number;
  unreadNotificationCount: number;
  latestRequest: {
    id: string;
    category: string;
    suburb: string;
    status: string;
    urgency: string;
    createdAt: string;
  } | null;
  latestBooking: {
    id: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
  } | null;
  latestNotification: {
    id: string;
    type: string;
    status: string;
    createdAt: string;
  } | null;
  recentRequests: Array<{
    id: string;
    category: string;
    suburb: string;
    status: string;
    createdAt: string;
  }>;
};

export type ProDashboardSummary = {
  proName: string;
  openLeadCount: number;
  bookingCount: number;
  completedCount: number;
  averageRating: number;
  latestLead: {
    id: string;
    category: string;
    suburb: string;
    status: string;
    createdAt: string;
  } | null;
  recentBookings: Array<{
    id: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
};

const activeBookingStatuses = ['pending', 'confirmed', 'in_progress'] as const;
const demoCustomerUserId = '00000000-0000-0000-0000-000000000002';
const demoProUserId = '00000000-0000-0000-0000-000000000003';

export async function getCustomerDashboardData(customerUserId = demoCustomerUserId): Promise<CustomerDashboardSummary> {
  const supabase = getSupabaseServerClient();

  const { data: latestRequest } = await supabase
    .from('service_requests')
    .select('id, user_id, category, suburb, status, urgency, created_at')
    .eq('user_id', customerUserId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestRequest) {
    return {
      customerName: 'Customer',
      requestCount: 0,
      activeBookingCount: 0,
      unreadNotificationCount: 0,
      latestRequest: null,
      latestBooking: null,
      latestNotification: null,
      recentRequests: [],
    };
  }

  const [{ data: customer }, { data: recentRequests }, { data: bookings }, { data: notifications }, { count: requestCount }, { count: activeBookingCount }, { count: unreadNotificationCount }] = await Promise.all([
    supabase.from('users').select('full_name').eq('id', customerUserId).maybeSingle(),
    supabase
      .from('service_requests')
      .select('id, category, suburb, status, created_at')
      .eq('user_id', customerUserId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('bookings')
      .select('id, request_id, status, payment_status, created_at')
      .eq('request_id', latestRequest.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('notifications')
      .select('id, type, status, created_at')
      .eq('user_id', customerUserId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('user_id', customerUserId),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('request_id', latestRequest.id)
      .in('status', [...activeBookingStatuses]),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', customerUserId)
      .is('read_at', null),
  ]);

  return {
    customerName: customer?.full_name ?? 'Customer',
    requestCount: requestCount ?? 0,
    activeBookingCount: activeBookingCount ?? 0,
    unreadNotificationCount: unreadNotificationCount ?? 0,
    latestRequest: {
      id: latestRequest.id,
      category: latestRequest.category,
      suburb: latestRequest.suburb,
      status: latestRequest.status,
      urgency: latestRequest.urgency,
      createdAt: latestRequest.created_at ?? new Date().toISOString(),
    },
    latestBooking: bookings?.[0]
      ? {
          id: bookings[0].id,
          status: bookings[0].status,
          paymentStatus: bookings[0].payment_status,
          createdAt: bookings[0].created_at ?? new Date().toISOString(),
        }
      : null,
    latestNotification: notifications?.[0]
      ? {
          id: notifications[0].id,
          type: notifications[0].type,
          status: notifications[0].status,
          createdAt: notifications[0].created_at ?? new Date().toISOString(),
        }
      : null,
    recentRequests: (recentRequests ?? []).map((request) => ({
      id: request.id,
      category: request.category,
      suburb: request.suburb,
      status: request.status,
      createdAt: request.created_at ?? new Date().toISOString(),
    })),
  };
}

export async function getProDashboardData(proUserId = demoProUserId): Promise<ProDashboardSummary> {
  const supabase = getSupabaseServerClient();

  const [{ data: user }, { data: proRow }] = await Promise.all([
    supabase.from('users').select('id, full_name').eq('id', proUserId).maybeSingle(),
    supabase.from('pros').select('id, trade_category, rating').eq('user_id', proUserId).maybeSingle(),
  ]);

  if (!proRow) {
    return {
      proName: user?.full_name ?? 'Pro',
      openLeadCount: 0,
      bookingCount: 0,
      completedCount: 0,
      averageRating: 0,
      latestLead: null,
      recentBookings: [],
    };
  }

  const [{ data: requests }, { data: recentBookings }, { count: leadCount }, { count: bookingCount }, { count: completedCount }] = await Promise.all([
    supabase
      .from('service_requests')
      .select('id, category, suburb, status, created_at')
      .in('status', ['submitted', 'matched'])
      .eq('category', proRow.trade_category)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('bookings')
      .select('id, status, payment_status, created_at')
      .eq('pro_id', proRow.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'matched']).eq('category', proRow.trade_category),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('pro_id', proRow.id),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('pro_id', proRow.id).eq('status', 'completed'),
  ]);

  return {
    proName: user?.full_name ?? 'Pro',
    openLeadCount: leadCount ?? 0,
    bookingCount: bookingCount ?? 0,
    completedCount: completedCount ?? 0,
    averageRating: Number(proRow.rating ?? 0),
    latestLead: requests?.[0]
      ? {
          id: requests[0].id,
          category: requests[0].category,
          suburb: requests[0].suburb,
          status: requests[0].status,
          createdAt: requests[0].created_at ?? new Date().toISOString(),
        }
      : null,
    recentBookings: (recentBookings ?? []).map((booking) => ({
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status,
      createdAt: booking.created_at ?? new Date().toISOString(),
    })),
  };
}
