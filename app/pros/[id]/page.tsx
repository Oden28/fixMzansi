import { Container } from '@/components/layout/Container';
import Image from 'next/image';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getProProfilePhotoUrl } from '@/lib/pro-avatar';

export default async function ProDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: pro } = await supabase
    .from('pros')
    .select('id, user_id, trade_category, city, suburb_service_area, verification_status, rating, response_time_minutes, summary, profile_photo_url, certificate_files')
    .eq('id', id)
    .single();

  const { data: user } = pro
    ? await supabase.from('users').select('full_name').eq('id', pro.user_id).single()
    : { data: null };

  const profileName = user?.full_name ?? pro?.user_id ?? 'FixMzansi Pro';
  const profilePhoto = getProProfilePhotoUrl(profileName, pro?.profile_photo_url);

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <h1 className="text-3xl font-semibold">Pro profile</h1>
        <p className="mt-3 text-slate-300">Pro ID: {id}</p>
        {pro ? (
          <div className="mt-6 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm text-slate-300">
            <div className="mb-4 flex items-center gap-4">
              <Image
                src={profilePhoto}
                alt={`${profileName} profile photo`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-2xl border border-slate-700 object-cover"
                unoptimized
              />
              <div>
                <p className="text-base font-semibold text-white">{profileName}</p>
                <p className="text-slate-400">{pro.trade_category} · {pro.city}</p>
              </div>
            </div>
            <p><span className="text-white">Trade:</span> {pro.trade_category}</p>
            <p><span className="text-white">City:</span> {pro.city}</p>
            <p><span className="text-white">Verification:</span> {pro.verification_status}</p>
            <p><span className="text-white">Rating:</span> {pro.rating}</p>
            <p className="mt-2">{pro.summary}</p>
          </div>
        ) : (
          <p className="mt-3 text-slate-300">This pro was not found yet.</p>
        )}
      </Container>
    </main>
  );
}
