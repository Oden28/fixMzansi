import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { matchAndPersistRequest } from '@/lib/matching-service';
import { getApiSession, isValidUUID } from '@/lib/api-auth';

export async function POST(request: Request) {
  try {
    const session = await getApiSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = (await request.json()) as {
      entityType?: 'pro' | 'request';
      id?: string;
      action?: 'approve' | 'reject';
    };

    if (!body.entityType || !body.id || !body.action) {
      return NextResponse.json({ error: 'entityType, id, and action are required' }, { status: 400 });
    }

    if (!['pro', 'request'].includes(body.entityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!isValidUUID(body.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (body.entityType === 'pro') {
      const verificationStatus = body.action === 'approve' ? 'verified' : 'rejected';
      const { error } = await supabase
        .from('pros')
        .update({ verification_status: verificationStatus })
        .eq('id', body.id);

      if (error) throw error;

      revalidatePath('/admin');
      return NextResponse.json({ success: true, entityType: 'pro', id: body.id, status: verificationStatus });
    }

    const requestStatus = body.action === 'approve' ? 'matched' : 'cancelled';
    const { data: requestRow, error: requestError } = await supabase
      .from('service_requests')
      .select('id, status')
      .eq('id', body.id)
      .single();

    if (requestError || !requestRow) throw requestError ?? new Error('Request not found');

    if (body.action === 'approve') {
      const { error: statusError } = await supabase
        .from('service_requests')
        .update({ status: 'submitted' })
        .eq('id', body.id);

      if (statusError) throw statusError;

      await matchAndPersistRequest(supabase, body.id);
    } else {
      const { error: statusError } = await supabase
        .from('service_requests')
        .update({ status: requestStatus })
        .eq('id', body.id);

      if (statusError) throw statusError;
    }

    revalidatePath('/admin');
    return NextResponse.json({ success: true, entityType: 'request', id: body.id, status: requestStatus });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process moderation action';
    console.error('[admin/moderation] POST error:', message);
    return NextResponse.json({ error: 'Failed to process moderation action' }, { status: 500 });
  }
}
