import Link from 'next/link';

/** Slim fixed header for guests off the landing page (login, pros, requests, etc.). */
export function GuestMinimalHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-slate-800/90 bg-slate-950/95 px-4 backdrop-blur-xl sm:px-6">
      <Link href="/" className="inline-cta flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-200">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-xs font-bold text-white shadow-md shadow-emerald-950/40">
          FM
        </span>
        FixMzansi
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-cta rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="inline-cta rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-950/30 transition hover:brightness-110"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
