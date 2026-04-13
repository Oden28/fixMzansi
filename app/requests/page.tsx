import { Container } from '@/components/layout/Container';
import { RequestForm } from '@/components/forms/RequestForm';
import { TaskFlowSteps } from '@/components/booking/TaskFlowSteps';
import { extractIdentityScopeFromRecord } from '@/lib/identity-scope';

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = extractIdentityScopeFromRecord((await searchParams) ?? {});

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100 md:py-14">
      <Container>
        <div className="space-y-8">
          <TaskFlowSteps current={1} scope={scope} />

          <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start">
            <section className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">1: Describe your task</p>
                <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Tell us about your solar job in Cape Town</h1>
                <p className="mt-3 max-w-xl text-slate-300">
                  We use these details to show verified pros who fit your task, area, and timeline. You can still adjust details with your pro after booking.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-950/10 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm text-slate-200">
                  <li>2. Browse pros and compare price, reviews, and response speed.</li>
                  <li>3. Choose your preferred date and start time.</li>
                  <li>4. Confirm details, deposit policy, and book securely.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[var(--color-surface)] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Task quality tips</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>• Add the exact suburb and unit/building access notes.</li>
                  <li>• Mention system size, inverter, or battery model if known.</li>
                  <li>• Include constraints (stairs, roof access, parking).</li>
                  <li>• State urgency honestly to improve availability matching.</li>
                </ul>
              </div>
            </section>

            <section>
              <RequestForm />
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
