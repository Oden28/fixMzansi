'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminQueueTable } from './AdminQueueTable';
import type { AdminDashboardPayload } from '@/lib/admin';

const initialState: AdminDashboardPayload = {
  kpis: [],
  queue: [],
};

export function AdminDashboardClient() {
  const [data, setData] = useState<AdminDashboardPayload>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/queue', { cache: 'no-store' });
      const payload = (await response.json()) as AdminDashboardPayload & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Failed to load dashboard data');
      }

      setData({ kpis: payload.kpis ?? [], queue: payload.queue ?? [] });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
    const timer = window.setInterval(() => {
      void loadDashboard();
    }, 15000);

    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  const visibleKpis = useMemo(() => data.kpis.slice(0, 6), [data.kpis]);

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Operations dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Admin console</h1>
        <p className="mt-3 text-slate-300">
          Live moderation, queue monitoring, and Supabase-backed KPIs for the FixMzansi operations team.
        </p>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && visibleKpis.length === 0
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-[28px] border border-slate-800/80 bg-[var(--color-surface)] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                <div className="mt-4 h-10 w-20 animate-pulse rounded bg-slate-800" />
              </div>
            ))
          : visibleKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-[28px] border border-slate-800/80 bg-[var(--color-surface)] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
                <p className="text-sm text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{kpi.value}</p>
                {kpi.delta ? <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{kpi.delta}</p> : null}
              </div>
            ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Moderation queue</h2>
              <p className="mt-1 text-sm text-slate-400">Approve or reject pros and service requests as they come in.</p>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white"
            >
              Refresh
            </button>
          </div>
          <AdminQueueTable rows={data.queue} onRefresh={loadDashboard} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800/80 bg-[var(--color-surface)] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
            <h3 className="text-lg font-semibold text-white">Live status</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The dashboard polls Supabase every 15 seconds so the queue, KPIs, and moderation actions stay current.
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-800/80 bg-[var(--color-surface)] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
            <h3 className="text-lg font-semibold text-white">Review and notification queues</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Pending reviews and queued notifications are included in the live feed for a more complete operations view.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
