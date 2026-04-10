import { Container } from '@/components/layout/Container';

const steps = [
  {
    title: '1. Tell us what you need',
    body: 'Create a request with your location, urgency, and job details.',
  },
  {
    title: '2. We match trusted pros',
    body: 'Your request is ranked against Cape Town pros based on category, area, speed, and trust.',
  },
  {
    title: '3. Book and track progress',
    body: 'Choose a provider, confirm the job, and follow status updates in your dashboard.',
  },
  {
    title: '4. Review the work',
    body: 'Once the job is complete, submit a review to help keep the marketplace trustworthy.',
  },
];

const faqs = [
  ['How are pros verified?', 'Verification checks business details, profile quality, and supporting documents before approval.'],
  ['How does matching work?', 'We rank pros by trade fit, suburb coverage, verification, response speed, and ratings.'],
  ['How do bookings work?', 'Customers pick a pro, create a booking, and track progress through the booking lifecycle.'],
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="max-w-3xl rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Trust center</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">How FixMzansi works</h1>
          <p className="mt-4 text-slate-300">
            A clear, trust-first workflow for connecting homeowners with verified solar professionals in Cape Town.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {steps.map((step) => (
            <article key={step.title} className="rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
              <h2 className="text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{step.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-800 bg-[var(--color-surface)] p-6">
          <h2 className="text-xl font-semibold text-white">FAQ</h2>
          <div className="mt-4 grid gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4">
                <p className="font-medium text-white">{question}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
