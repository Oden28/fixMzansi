import { Container } from '@/components/layout/Container';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Effective date: 9 April 2026. This policy explains how FixMzansi collects, uses, and protects data
          for marketplace requests, matching, booking, and support.
        </p>

        <section className="mt-10 space-y-6 rounded-[24px] border border-slate-800 bg-[var(--color-surface)] p-6 text-sm leading-7 text-slate-300">
          <div>
            <h2 className="text-lg font-semibold text-white">1. Data we collect</h2>
            <p>
              Contact details, service request information, suburb and location context, booking activity,
              provider verification data, and review metadata.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">2. How we use data</h2>
            <p>
              We use data to match customers with relevant providers, operate notifications, prevent abuse,
              support disputes, and improve marketplace quality.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">3. Data sharing</h2>
            <p>
              We share limited booking and request data with selected providers required to fulfill services.
              We do not sell personal information to unrelated third parties.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">4. Storage and security</h2>
            <p>
              Data is stored using managed infrastructure and protected with access controls, auditability, and
              validation. No internet platform can guarantee absolute security.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">5. Retention</h2>
            <p>
              We retain records as needed for bookings, compliance, and fraud prevention. Inactive account data
              may be deleted or anonymized when no longer required.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">6. Your rights</h2>
            <p>
              You may request access, correction, or deletion of personal data by emailing
              support@fixmzansi.co.za. We may request identity verification before completing sensitive requests.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
