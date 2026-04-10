'use client';

import type { AdminQueueItem } from '@/lib/admin';

type Props = {
  rows: AdminQueueItem[];
  onRefresh: () => void | Promise<void>;
};

export function AdminQueueTable({ rows, onRefresh }: Props) {
  async function moderate(entityType: 'pro' | 'request', id: string, action: 'approve' | 'reject') {
    await fetch('/api/admin/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, id, action }),
    });
    await onRefresh();
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-800 bg-[var(--color-surface)]">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-950/40 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
          <tr>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-950/30">
              <td className="px-6 py-4 capitalize">{row.type}</td>
              <td className="px-6 py-4 text-white">
                <div>{row.title}</div>
                {row.description ? <div className="mt-1 text-xs text-slate-400">{row.description}</div> : null}
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">{row.status}</span>
                {row.meta?.length ? <div className="mt-2 text-xs text-slate-500">{row.meta.join(' • ')}</div> : null}
              </td>
              <td className="px-6 py-4">{new Date(row.createdAt).toLocaleString()}</td>
              <td className="px-6 py-4">
                {row.type === 'request' || row.type === 'pro' ? (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void moderate(row.type as 'pro' | 'request', row.id, 'approve')} className="rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white">
                      Approve
                    </button>
                    <button type="button" onClick={() => void moderate(row.type as 'pro' | 'request', row.id, 'reject')} className="rounded-full border border-rose-900/70 px-3 py-1.5 text-xs font-medium text-rose-200">
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Read only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
