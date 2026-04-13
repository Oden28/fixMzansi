import Link from 'next/link';
import { buildScopedPath } from '@/lib/identity-scope';

export function BookProButton({
  requestId,
  proId,
  customerUserId,
}: {
  requestId: string;
  proId: string;
  customerUserId?: string;
}) {
  const loginNext = encodeURIComponent(`/bookings/schedule?requestId=${requestId}&proId=${proId}`);
  const schedulePath = buildScopedPath(`/bookings/schedule?requestId=${requestId}&proId=${proId}`, {
    customerUserId,
  });
  const loginPath = buildScopedPath(`/login?next=${loginNext}`, {
    customerUserId,
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={schedulePath}
        className="touch-target inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:bg-sky-500"
      >
        Select & Continue
      </Link>
      <Link
        href={loginPath}
        className="touch-target inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition duration-[var(--motion-base)] hover:border-slate-500"
      >
        Log in first
      </Link>
    </div>
  );
}
