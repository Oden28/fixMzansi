'use client';

import { useRouter } from 'next/navigation';

export function SignOutButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className={`inline-cta w-full rounded-xl border border-slate-600 px-3 py-2.5 text-sm font-medium text-slate-200 transition duration-[var(--motion-base)] hover:border-slate-500 hover:bg-slate-800 hover:text-white ${className}`}
    >
      Sign out
    </button>
  );
}
