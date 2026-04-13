import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getApiSession, isValidUUID } from '@/lib/api-auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
    }

    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('service_requests')
      .select('id, user_id, category, suburb, description, urgency, status, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Only the owner or admin can see a request detail
    if (session.role !== 'admin' && data.user_id !== session.sub) {
      return NextResponse.json({ error: 'Not authorized to view this request' }, { status: 403 });
    }

    return NextResponse.json({ request: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch request';
    console.error('[requests/[id]] GET error:', message);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}
