import { Container } from '@/components/layout/Container';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Effective date: 9 April 2026. These terms govern use of the FixMzansi marketplace for finding and
          booking solar professionals in Cape Town.
        </p>

        <section className="mt-10 space-y-6 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm leading-7 text-slate-300">
          <div>
            <h2 className="text-lg font-semibold text-white">1. Marketplace role</h2>
            <p>
              FixMzansi connects customers with independent providers. Providers are responsible for the
              workmanship, timelines, and on-site conduct of services they deliver.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">2. Account and eligibility</h2>
            <p>
              You must provide accurate contact and booking information. You may not impersonate another person
              or submit fraudulent requests, reviews, or verification documents.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">3. Bookings and payments</h2>
            <p>
              Quotes and price estimates are supplied by providers. Where deposits are collected, payment terms
              are displayed before confirmation. Refund and cancellation outcomes depend on booking status and
              provider terms.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">4. Reviews and trust signals</h2>
            <p>
              Reviews are restricted to completed jobs. We may moderate, remove, or investigate content that is
              abusive, misleading, or unrelated to a real booking.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">5. Liability limits</h2>
            <p>
              To the maximum extent allowed by law, FixMzansi is not liable for indirect or consequential loss,
              including lost profits, delays, or third-party misconduct outside our direct control.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">6. Support and disputes</h2>
            <p>
              If a booking goes wrong, contact support at support@fixmzansi.co.za with booking details. We use
              reasonable efforts to assist resolution between customer and provider.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
