'use client';

import { Container } from '@/components/layout/Container';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 py-24 text-slate-100">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-[var(--radius-card)] border border-rose-500/20 bg-rose-500/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-400">Something went wrong</p>
            <h1 className="mt-3 text-2xl font-bold text-white">We hit an unexpected error</h1>
            <p className="mt-4 text-sm text-slate-400">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            {error.digest ? (
              <p className="mt-2 text-xs text-slate-500">Error ID: {error.digest}</p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Try again
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
