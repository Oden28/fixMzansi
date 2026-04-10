export type KpiCard = {
  label: string;
  value: string;
  helper?: string;
};

export function KpiGrid({ cards }: { cards: KpiCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
          {card.helper ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{card.helper}</p> : null}
        </article>
      ))}
    </section>
  );
}
