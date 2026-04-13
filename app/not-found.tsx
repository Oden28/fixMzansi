import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 py-24 text-slate-100">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-[var(--radius-card)] border border-slate-800 bg-[var(--color-surface)] p-8">
            <p className="text-6xl font-bold text-emerald-500">404</p>
            <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
            <p className="mt-3 text-sm text-slate-400">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
