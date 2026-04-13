import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { matchAndPersistRequest } from '@/lib/matching-service';
import { getApiSession } from '@/lib/api-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Rate limit: 5 match requests per minute
    const ip = getClientIp(request);
    const rl = checkRateLimit(`match:${ip}`, { maxRequests: 5, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', matches: [] },
        { status: 429, headers: { 'Retry-After': String(rl.resetInSec) } },
      );
    }

    const session = await getApiSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', matches: [] }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    const { data: requestRow, error: requestError } = await supabase
      .from('service_requests')
      .select('id')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (requestError) throw requestError;

    if (!requestRow) {
      return NextResponse.json({ matches: [], message: 'No submitted requests found yet.' });
    }

    const matches = await matchAndPersistRequest(supabase, requestRow.id);

    return NextResponse.json({ requestId: requestRow.id, matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to build matches';
    console.error('[match] GET error:', message);
    return NextResponse.json({ error: 'Failed to build matches', matches: [] }, { status: 500 });
  }
}
