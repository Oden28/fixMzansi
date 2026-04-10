'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthRole } from '@/lib/auth-flow';
import { safeInternalPath } from '@/lib/safe-redirect';

const roleOptions: Array<{ role: AuthRole; title: string; description: string }> = [
  {
    role: 'customer',
    title: 'Customer',
    description: 'Post a job, compare trusted pros, and track booking progress.',
  },
  {
    role: 'pro',
    title: 'Pro',
    description: 'Receive matched leads, manage your pipeline, and grow your reputation.',
  },
  {
    role: 'admin',
    title: 'Admin',
    description: 'Moderate supply quality, monitor activity, and keep trust high.',
  },
];

type AuthMode = 'login' | 'register';

export function AuthFlowForm({
  defaultMode,
  redirectHint,
}: {
  defaultMode: AuthMode;
  redirectHint?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [role, setRole] = useState<AuthRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedRole = useMemo(() => roleOptions.find((option) => option.role === role) ?? roleOptions[0], [role]);
  const safeNext = safeInternalPath(redirectHint);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mode,
          role,
          fullName: fullName.trim() || undefined,
          email: email.trim(),
          password,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        account?: { id: string; email?: string | null; role?: string | null };
        nextPath?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to continue right now');
      }

      setMessage(mode === 'register' ? 'Account created. Redirecting…' : 'Welcome back. Redirecting…');

      const destination = safeNext ?? payload.nextPath ?? '/';
      router.push(destination);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to continue right now');
    } finally {
      setPending(false);
    }
  }

  const modeSwitchClass = (active: boolean) =>
    `rounded-full px-4 py-2.5 text-sm font-medium transition duration-[var(--motion-base)] min-h-[44px] ${
      active ? 'bg-[var(--color-primary)] text-white shadow-md shadow-emerald-950/25' : 'border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white'
    }`;

  const roleCardClass = (active: boolean) =>
    `rounded-2xl border p-4 text-left transition duration-[var(--motion-base)] min-h-[120px] ${
      active
        ? 'border-emerald-500/70 bg-emerald-950/40 text-emerald-50 ring-1 ring-emerald-500/30'
        : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600'
    }`;

  return (
    <section className="mt-8 rounded-[var(--radius-card)] border border-slate-800 bg-[var(--color-surface)] p-6 shadow-2xl shadow-black/40 md:p-8">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode('login')} className={modeSwitchClass(mode === 'login')}>
          Log in
        </button>
        <button type="button" onClick={() => setMode('register')} className={modeSwitchClass(mode === 'register')}>
          Sign up
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {mode === 'register'
          ? 'Create an account and go straight to the workspace for the role you choose.'
          : 'Use the same role you registered with (customer, pro, or admin).'}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {roleOptions.map((option) => (
          <button
            key={option.role}
            type="button"
            onClick={() => setRole(option.role)}
            className={roleCardClass(role === option.role)}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/90">{option.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{option.description}</p>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-4">
        {mode === 'register' ? (
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="min-h-[44px] rounded-2xl border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-ring)]"
              required
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={`you@${selectedRole.role === 'customer' ? 'example' : 'business'}.com`}
            autoComplete="email"
            className="min-h-[44px] rounded-2xl border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-ring)]"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            placeholder="At least 8 characters"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            className="min-h-[44px] rounded-2xl border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-ring)]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="min-h-[48px] rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Please wait…' : mode === 'register' ? `Create ${selectedRole.title} account` : `Continue as ${selectedRole.title}`}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        {mode === 'register' ? 'Already have an account?' : 'New to FixMzansi?'}{' '}
        <Link
          href={mode === 'register' ? '/login' : '/register'}
          className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          {mode === 'register' ? 'Log in' : 'Sign up'}
        </Link>
      </p>

      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
    </section>
  );
}
