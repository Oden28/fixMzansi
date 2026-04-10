import { Container } from '@/components/layout/Container';
import { RequestForm } from '@/components/forms/RequestForm';

export default function RequestsPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Left column: info */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Get matched</p>
              <h1 className="mt-3 text-4xl font-bold text-white">Request a solar professional</h1>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                Tell us what you need. We&apos;ll quickly match you with verified Cape Town solar pros who are available and qualified for your job.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-950/5 p-6 backdrop-blur">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">✓</span>
                What happens next
              </h2>
              <ol className="mt-6 space-y-4">
                {[
                  { step: '1', title: 'Submit request', desc: 'Describe your solar work needs' },
                  { step: '2', title: 'Instant matching', desc: 'Get matched with top-rated local pros' },
                  { step: '3', title: 'Compare & choose', desc: 'Review quotes and pick your pro' },
                  { step: '4', title: 'Book & track', desc: 'Confirm details and track the job live' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 font-semibold text-emerald-400 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3  border-t border-slate-800 pt-8">
              <h3 className="font-semibold text-white">Tips for best matches:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ Be specific about your work type and scope</li>
                <li>✓ Include photos of your roof or installation area if possible</li>
                <li>✓ Set a realistic timeline for urgency</li>
                <li>✓ Provide accurate location details</li>
              </ul>
            </div>
          </div>

          {/* Right column: form */}
          <div>
            <RequestForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
