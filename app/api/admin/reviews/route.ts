import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getApiSession } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getApiSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required', reviews: [] }, { status: 403 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('reviews')
      .select('id, booking_id, user_id, pro_id, rating, text, verified, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ reviews: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load review queue';
    console.error('[admin/reviews] GET error:', message);
    return NextResponse.json({ error: 'Failed to load review queue', reviews: [] }, { status: 500 });
  }
}
