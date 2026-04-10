import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
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
    return NextResponse.json({ error: message, reviews: [] }, { status: 500 });
  }
}
