'use client';

import { Suspense, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { AppSession } from '@/lib/server-session';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MarketingTopNav } from '@/components/layout/MarketingTopNav';
import { GuestMinimalHeader } from '@/components/layout/GuestMinimalHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { extractIdentityScopeFromSearchParams } from '@/lib/nav-scope';

function MarketingNavWithUrlScope() {
  const searchParams = useSearchParams();
  const scope = useMemo(() => extractIdentityScopeFromSearchParams(searchParams), [searchParams]);
  return <MarketingTopNav scope={scope} />;
}

export function ChromeClient({
  initialSession,
  children,
}: {
  initialSession: AppSession | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (initialSession) {
    return (
      <div className="min-h-screen">
        <AppSidebar session={initialSession} />
        <div className="flex min-h-screen flex-col pt-14 lg:pt-0 lg:pl-64">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isHome ? (
        <Suspense fallback={<MarketingTopNav scope={{}} />}>
          <MarketingNavWithUrlScope />
        </Suspense>
      ) : (
        <GuestMinimalHeader />
      )}
      <div className={`flex-1 ${isHome ? '' : 'pt-14'}`}>{children}</div>
      <SiteFooter />
    </div>
  );
}
