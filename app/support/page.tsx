import { Container } from '@/components/layout/Container';

const supportChannels = [
  {
    title: 'General support',
    detail: 'support@fixmzansi.co.za',
    description: 'Booking issues, account access, and request flow support.',
  },
  {
    title: 'Provider verification',
    detail: 'vetting@fixmzansi.co.za',
    description: 'Certificate checks, profile verification, and onboarding updates.',
  },
  {
    title: 'Disputes and trust',
    detail: 'trust@fixmzansi.co.za',
    description: 'Completed-job disputes, review moderation, and safety escalation.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <h1 className="text-3xl font-semibold">Support</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          FixMzansi support is structured for fast triage so customers and providers can resolve booking issues
          quickly and continue work with confidence.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {supportChannels.map((channel) => (
            <article key={channel.title} className="rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{channel.title}</p>
              <p className="mt-3 text-base font-semibold text-white">{channel.detail}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{channel.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm leading-7 text-slate-300">
          <h2 className="text-lg font-semibold text-white">When contacting support</h2>
          <p className="mt-2">
            Include your booking ID, request category, suburb, and a short timeline of what happened. This helps
            us route your case to the right operations queue without delay.
          </p>
        </section>
      </Container>
    </main>
  );
}
