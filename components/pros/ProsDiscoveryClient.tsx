'use client';

import { useMemo, useState } from 'react';
import type { ProProfile, TradeCategory } from '@/lib/types';
import { filterPros, getDiscoveryCategories } from '@/lib/pro-discovery';
import { ProCard } from '@/components/cards/ProCard';
import { buildScopedPath, type IdentityScope } from '@/lib/identity-scope';
import Link from 'next/link';

export function ProsDiscoveryClient({ pros, scope }: { pros: ProProfile[]; scope: IdentityScope }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<TradeCategory | 'all'>('all');

  const categories = useMemo(() => getDiscoveryCategories(pros), [pros]);
  const filteredPros = useMemo(() => filterPros({ pros, category, query }), [pros, category, query]);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex-1 text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">Search pros</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, suburb, or expertise"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[var(--color-ring)]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  item === category
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPros.map((pro) => (
          <Link key={pro.id} href={buildScopedPath(`/pros/${pro.id}`, scope)} className="block">
            <ProCard pro={pro} />
          </Link>
        ))}
      </div>

      {filteredPros.length === 0 ? (
        <p className="rounded-2xl border border-slate-800 bg-[var(--color-surface)] px-4 py-3 text-sm text-slate-300">
          No pros matched your search yet. Try another suburb, category, or broader keyword.
        </p>
      ) : null}
    </section>
  );
}
