import Link from 'next/link';

export function DashboardShell({
  title,
  description,
  children,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
        </div>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref} className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-500">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}
