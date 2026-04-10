import { getSupabaseServerClient } from './supabase-server';
import { samplePros } from './seed-data';
import type { ProProfile } from './types';

type ProRow = {
  id: string;
  user_id: string;
  trade_category: ProProfile['tradeCategory'];
  city: string;
  suburb_service_area: string[];
  verification_status: ProProfile['verificationStatus'];
  rating: number;
  response_time_minutes: number;
  summary: string;
  profile_photo_url?: string | null;
};

function verificationPriority(status: ProProfile['verificationStatus']) {
  if (status === 'verified') return 0;
  if (status === 'pending') return 1;
  return 2;
}

export async function getFeaturedPros(limit = 4): Promise<ProProfile[]> {
  try {
    const supabase = getSupabaseServerClient();

    const { data: pros, error } = await supabase
      .from('pros')
      .select('id, user_id, trade_category, city, suburb_service_area, verification_status, rating, response_time_minutes, summary, profile_photo_url')
      .eq('city', 'Cape Town');

    if (error || !pros || pros.length === 0) {
      return samplePros.slice(0, limit);
    }

    const proRows = pros as ProRow[];
    const userIds = [...new Set(proRows.map((pro) => pro.user_id))];

    const { data: users } = await supabase
      .from('users')
      .select('id, full_name')
      .in('id', userIds);

    const userById = new Map((users ?? []).map((user) => [user.id, user.full_name]));

    return proRows
      .map((pro) => ({
        id: pro.id,
        name: userById.get(pro.user_id) ?? pro.user_id,
        tradeCategory: pro.trade_category,
        suburb: Array.isArray(pro.suburb_service_area) && pro.suburb_service_area.length > 0 ? pro.suburb_service_area[0] : pro.city,
        rating: Number(pro.rating),
        verificationStatus: pro.verification_status,
        responseTimeMinutes: Number(pro.response_time_minutes),
        summary: pro.summary,
        profilePhotoUrl: pro.profile_photo_url ?? undefined,
      }))
      .sort((a, b) => {
        const priorityDiff = verificationPriority(a.verificationStatus) - verificationPriority(b.verificationStatus);
        if (priorityDiff !== 0) return priorityDiff;
        return b.rating - a.rating;
      })
      .slice(0, limit);
  } catch {
    return samplePros.slice(0, limit);
  }
}
