import { getSupabaseServerClient } from './supabase-server';

export async function getLatestRequestWithMatches() {
  const supabase = getSupabaseServerClient();

  const { data: request, error } = await supabase
    .from('service_requests')
    .select('id, user_id, category, suburb, description, urgency, status, created_at')
    .eq('status', 'matched')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return request;
}
