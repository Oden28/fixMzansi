'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { AppSession } from '@/lib/server-session';
import { getSidebarSectionsForRole, roleLabel } from '@/lib/nav-role-items';
import { SignOutButton } from '@/components/layout/SignOutButton';

function shortEmail(email: string | null | undefined): string {
  if (!email) return 'Signed in';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const short = name.length > 16 ? `${name.slice(0, 14)}…` : name;
  return `${short}@${domain}`;
}

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition duration-[var(--motion-base)] ${
        active
          ? 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/35'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

export function AppSidebar({ session }: { session: AppSession }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = getSidebarSectionsForRole(session.role);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const sidebarInner = (
    <div className="flex h-full flex-col border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-5">
        <Link
          href="/"
          onClick={closeMobile}
          className="flex items-center gap-3 rounded-xl px-1 transition hover:text-emerald-200"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-sm font-bold text-white shadow-lg shadow-emerald-950/40">
            FM
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">FixMzansi</p>
            <p className="truncate text-xs font-medium uppercase tracking-wider text-emerald-500/90">{roleLabel(session.role)}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
        {sections.map((section) => (
          <div key={section.id} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} onNavigate={closeMobile} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <p className="mb-3 truncate px-1 text-xs text-slate-500" title={session.email ?? undefined}>
          {shortEmail(session.email)}
        </p>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top chrome: menu only (not a full marketing nav) */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-lg lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-700 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          aria-expanded={mobileOpen}
          aria-controls="app-sidebar-panel"
        >
          <span className="sr-only">Open menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/" className="truncate text-sm font-semibold text-white">
          FixMzansi
        </Link>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        id="app-sidebar-panel"
        className={`fixed bottom-0 left-0 top-0 z-50 w-64 max-w-[calc(100vw-2rem)] border-r border-slate-800 bg-slate-950 shadow-2xl shadow-black/40 transition-transform duration-[var(--motion-base)] ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarInner}
      </aside>
    </>
  );
}
