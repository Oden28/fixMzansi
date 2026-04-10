import type { SupabaseClient } from '@supabase/supabase-js';
import { matchPros } from './matching';
import { deriveRequestStatusAfterMatching } from './lifecycle';

export async function matchAndPersistRequest(supabase: SupabaseClient, requestId: string) {
  const { data: request, error: requestError } = await supabase
    .from('service_requests')
    .select('id, category, suburb, description, urgency, status')
    .eq('id', requestId)
    .single();

  if (requestError || !request) {
    throw requestError ?? new Error('Request not found');
  }

  const { data: pros, error: prosError } = await supabase
    .from('pros')
    .select('id, user_id, trade_category, suburb_service_area, verification_status, rating, response_time_minutes, summary, city')
    .eq('city', 'Cape Town')
    .eq('trade_category', request.category);

  if (prosError) throw prosError;

  const userIds = Array.from(new Set((pros ?? []).map((pro) => pro.user_id)));
  const { data: users } = await supabase.from('users').select('id, full_name').in('id', userIds);
  const userById = new Map((users ?? []).map((user) => [user.id, user.full_name]));

  const normalizedRequest = {
    id: request.id,
    category: request.category,
    suburb: request.suburb,
    description: request.description,
    urgency: request.urgency,
    status: request.status,
  };

  const normalizedPros = (pros ?? []).map((pro) => ({
    id: pro.id,
    name: userById.get(pro.user_id) ?? pro.user_id,
    tradeCategory: pro.trade_category,
    suburb: Array.isArray(pro.suburb_service_area) && pro.suburb_service_area.length > 0 ? pro.suburb_service_area[0] : pro.city,
    rating: Number(pro.rating),
    verificationStatus: pro.verification_status,
    responseTimeMinutes: pro.response_time_minutes,
    summary: pro.summary,
  }));

  const rankedMatches = matchPros(normalizedRequest, normalizedPros);

  await supabase.from('matches').delete().eq('request_id', requestId);

  const matchRecords = rankedMatches.map((pro, index) => ({
    request_id: requestId,
    pro_id: pro.id,
    rank_score: pro.score,
    match_reason: `Rank ${index + 1} for ${pro.tradeCategory} in Cape Town`,
  }));

  if (matchRecords.length > 0) {
    const { error: matchInsertError } = await supabase.from('matches').insert(matchRecords);
    if (matchInsertError) throw matchInsertError;
  }

  const nextRequestStatus = deriveRequestStatusAfterMatching(matchRecords.length);
  const { error: requestStatusError } = await supabase.from('service_requests').update({ status: nextRequestStatus }).eq('id', requestId);
  if (requestStatusError) throw requestStatusError;

  return rankedMatches;
}
