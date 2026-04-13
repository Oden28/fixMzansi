import { Container } from '@/components/layout/Container';
import { AuthFlowForm } from '@/components/auth/AuthFlowForm';
import { safeInternalPath } from '@/lib/safe-redirect';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextRaw = params?.next;
  const redirectHint = safeInternalPath(typeof nextRaw === 'string' ? nextRaw : undefined);

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="rounded-[var(--radius-card)] border border-slate-800 bg-gradient-to-br from-slate-900/80 to-[var(--color-surface)] p-8 shadow-2xl shadow-black/30">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400/90">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Log in to FixMzansi</h1>
            <p className="mt-4 text-slate-400 leading-relaxed">
              One flow for customers, pros, and operators. Pick your role, then enter the email and password you used when you signed up.
            </p>
          </div>

          <AuthFlowForm defaultMode="login" redirectHint={redirectHint} />
        </div>
      </Container>
    </main>
  );
}
