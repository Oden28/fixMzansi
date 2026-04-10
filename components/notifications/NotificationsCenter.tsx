'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type NotificationRecord = {
  id: string;
  user_id: string;
  channel: string;
  type: string;
  payload: Record<string, unknown> | null;
  status: string;
  read_at?: string | null;
  created_at?: string | null;
};

const filters = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'queue', label: 'Queued' },
] as const;

export function NotificationsCenter() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'queue'>('all');
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(
    async (nextFilter: 'all' | 'unread' | 'queue') => {
      try {
        setLoading(true);
        const query = new URLSearchParams({ filter: nextFilter });
        const response = await fetch(`/api/notifications?${query.toString()}`, {
          cache: 'no-store',
          credentials: 'include',
        });
        const payload = (await response.json()) as { notifications?: NotificationRecord[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? 'Failed to load notifications');
        setItems(payload.notifications ?? []);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadNotifications(filter);
  }, [filter, loadNotifications]);

  const unreadCount = useMemo(() => items.filter((item) => !item.read_at).length, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Inbox</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Notifications</h1>
          <p className="mt-3 text-slate-300">Track booking updates, match events, and review activity.</p>
        </div>
        <div className="rounded-full border border-slate-800 bg-[var(--color-surface)] p-1">
          {filters.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => setFilter(entry.key)}
              className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition duration-[var(--motion-fast)] ${filter === entry.key ? 'bg-[var(--color-primary)] text-white' : 'text-slate-300 hover:text-white'}`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
        <span className="rounded-full border border-slate-800 bg-[var(--color-surface)] px-3 py-1">Unread: {unreadCount}</span>
        <button type="button" onClick={() => void loadNotifications(filter)} className="touch-target rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition duration-[var(--motion-fast)] hover:border-slate-500">
          Refresh
        </button>
      </div>

      {error ? <div className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">{error}</div> : null}
      {loading ? <div className="text-sm text-slate-400">Loading notifications...</div> : null}

      <div className="grid gap-4">
        {items.map((notification) => (
          <article key={notification.id} className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{notification.type}</h2>
                <p className="mt-2 text-sm text-slate-300">Channel: {notification.channel}</p>
                <p className="mt-1 text-sm text-slate-400">User: {notification.user_id}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${notification.read_at ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {notification.read_at ? 'read' : notification.status}
                </span>
                {notification.created_at ? <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(notification.created_at).toLocaleString()}</span> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
