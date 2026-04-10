'use client';

import Link from 'next/link';

export function AuthRoleCards() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-slate-700">
      <p className="text-sm">Auth role cards were replaced by a coherent onboarding form.</p>
      <div className="mt-4 flex gap-3">
        <Link href="/login" className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white">
          Go to login
        </Link>
        <Link href="/register" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
          Go to register
        </Link>
      </div>
    </div>
  );
}
