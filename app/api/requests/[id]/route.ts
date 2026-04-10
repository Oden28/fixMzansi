import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('service_requests')
      .select('id, user_id, category, suburb, description, urgency, status, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json({ request: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
