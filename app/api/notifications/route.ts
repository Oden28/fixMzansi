import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { filterNotifications, markNotificationRead, type NotificationRecord } from '@/lib/notifications';
import { FM_SESSION_COOKIE, verifySessionToken } from '@/lib/session-cookie';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get('filter') ?? 'all') as 'all' | 'unread' | 'queue';

    const jar = await cookies();
    const token = jar.get(FM_SESSION_COOKIE)?.value;
    const session = token ? verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', notifications: [] }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, channel, type, payload, status, read_at, created_at, updated_at')
      .eq('user_id', session.sub)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ notifications: filterNotifications((data ?? []) as NotificationRecord[], filter) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load notifications';
    return NextResponse.json({ error: message, notifications: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { notificationId?: string };
    if (!body.notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    await markNotificationRead(supabase, body.notificationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update notification';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
