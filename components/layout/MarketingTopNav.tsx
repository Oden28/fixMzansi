import Link from 'next/link';
import { buildScopedPath, type IdentityScope } from '@/lib/identity-scope';

const discoverLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pros', label: 'Browse pros' },
  { href: '/requests', label: 'Post a request' },
];

/** Full-width marketing header — only used on the landing page for guests. */
export function MarketingTopNav({ scope }: { scope: IdentityScope }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 sm:min-h-[72px]">
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <Link
              href="/"
              className="inline-cta flex items-center gap-3 rounded-full px-1 text-lg font-semibold text-white transition hover:text-emerald-200"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-sm font-bold text-white shadow-lg shadow-emerald-950/40">
                FM
              </span>
              <span className="whitespace-nowrap">FixMzansi</span>
            </Link>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:justify-center md:gap-x-2">
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 md:inline">Discover</span>
            {discoverLinks.map((link) => (
              <Link
                key={link.href}
                href={buildScopedPath(link.href, scope)}
                className="inline-cta rounded-full border border-transparent px-3 py-2 text-sm text-slate-300 transition duration-[var(--motion-base)] hover:border-slate-700 hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800/80 pt-3 sm:border-0 sm:pt-0">
            <Link
              href={buildScopedPath('/login', scope)}
              className="inline-cta rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition duration-[var(--motion-base)] hover:text-white"
            >
              Log in
            </Link>
            <Link
              href={buildScopedPath('/register', scope)}
              className="inline-cta rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-950/30 transition hover:brightness-110"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
