'use client';

import { useState } from 'react';

export function ReviewForm({ bookingId, proId }: { bookingId: string; proId: string }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function submitReview() {
    setState('saving');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, proId, rating, text }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      setState('saved');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6">
      <h3 className="text-lg font-semibold text-white">Leave a review</h3>
      <div className="mt-4 flex gap-2">
        {[1,2,3,4,5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} className={`touch-target rounded-full px-3 py-1 text-sm transition duration-[var(--motion-fast)] ${rating >= value ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
            {value}
          </button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition duration-[var(--motion-fast)] focus:border-[var(--color-ring)]" placeholder="Tell us about the work quality..." />
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={submitReview} className="touch-target rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:bg-sky-500">
          {state === 'saving' ? 'Saving...' : 'Submit review'}
        </button>
        {state === 'saved' ? <span className="text-sm text-emerald-300">Review saved.</span> : null}
        {state === 'error' ? <span className="text-sm text-rose-300">Something went wrong.</span> : null}
      </div>
    </div>
  );
}
