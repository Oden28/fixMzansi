import { Container } from '@/components/layout/Container';

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 py-24 text-slate-100">
      <Container>
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800/80" />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="rounded-[var(--radius-card)] border border-slate-800 bg-[var(--color-surface)] p-5">
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800/80" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-800/70" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-800/60" />
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500">Loading your workspace...</p>
        </div>
      </Container>
    </main>
  );
}
