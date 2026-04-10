import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { matchAndPersistRequest } from '@/lib/matching-service';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .select('id')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (requestError) throw requestError;

    if (!request) {
      return NextResponse.json({ matches: [], message: 'No submitted requests found yet.' });
    }

    const matches = await matchAndPersistRequest(supabase, request.id);

    return NextResponse.json({ requestId: request.id, matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to build matches';
    return NextResponse.json({ error: message, matches: [] }, { status: 500 });
  }
}
