import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('pros')
      .select('id, user_id, trade_category, city, suburb_service_area, verification_status, rating, response_time_minutes, summary, profile_photo_url, certificate_files, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json({ pro: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pro';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
