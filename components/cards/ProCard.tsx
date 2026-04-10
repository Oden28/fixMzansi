import Link from 'next/link';
import Image from 'next/image';
import type { ProProfile } from '@/lib/types';
import { getProProfilePhotoUrl } from '@/lib/pro-avatar';
import { Badge } from '@/components/ui/Badge';

export function ProCard({ pro }: { pro: ProProfile }) {
  const photoUrl = getProProfilePhotoUrl(pro.name, pro.profilePhotoUrl);

  return (
    <Link href={`/pros/${pro.id}`}>
      <article className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-6 shadow-lg shadow-black/20 transition-all duration-[var(--motion-base)] hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20 backdrop-blur-sm cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Image
              src={photoUrl}
              alt={`${pro.name} profile photo`}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl border-2 border-slate-700 object-cover shadow-lg group-hover:border-emerald-500/50 transition-all duration-[var(--motion-base)]"
              unoptimized
            />
            {pro.verificationStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1 text-white shadow-lg">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">{pro.name}</h3>
                <p className="mt-1 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{pro.suburb} · {pro.tradeCategory}</p>
              </div>
              <Badge variant="success" size="sm">
                {pro.verificationStatus === 'verified' ? '✓ Verified' : 'Pending'}
              </Badge>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300 group-hover:text-slate-200 transition-colors line-clamp-2">
              {pro.summary}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4 group-hover:border-emerald-500/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold text-white">{pro.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-500">(view reviews)</span>
                </div>
              </div>
              <div className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                {pro.responseTimeMinutes} min avg response
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
