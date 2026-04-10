import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProCard } from '@/components/cards/ProCard';
import { getLatestRequestWithMatches } from '@/lib/request-service';
import { getFeaturedPros } from '@/lib/featured-pros';

const kpis = [
  { label: 'Verified professionals', value: '24', icon: '✓' },
  { label: 'Requests matched', value: '18', icon: '🎯' },
  { label: 'Successful bookings', value: '7', icon: '📅' },
  { label: 'Avg response time', value: '<2h', icon: '⚡' },
];

const features = [
  {
    icon: '🔍',
    title: 'Verified professionals',
    description: 'Every pro is vetted, certified, and rated by real customers.',
  },
  {
    icon: '📊',
    title: 'Transparent pricing',
    description: 'Compare quotes side-by-side. No hidden fees or surprises.',
  },
  {
    icon: '📱',
    title: 'Book instantly',
    description: 'Request → Match → Book in under 2 minutes.',
  },
  {
    icon: '💬',
    title: 'Live updates',
    description: 'Stay informed with real-time notifications and progress tracking.',
  },
  {
    icon: '⭐',
    title: 'Reviewed & rated',
    description: 'Only verified reviews from completed jobs build the rating system.',
  },
  {
    icon: '🛡️',
    title: 'Protected bookings',
    description: 'Your booking details are secure on our trusted platform.',
  },
];

export default async function HomePage() {
  const latestRequest = await getLatestRequestWithMatches().catch(() => null);
  const featuredPros = await getFeaturedPros(2);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero section */}
      <section className="relative border-b border-slate-900 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl" />
        </div>

        <Container>
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live in Cape Town • Solar verified • Same-day matching
            </div>

            <div>
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Trusted solar pros,
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  instantly booked
                </span>
              </h1>
            </div>

            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              FixMzansi connects homeowners and businesses with verified solar professionals in Cape Town. Get matched, book safely, and track your job end-to-end.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/requests"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-950/30 transition-all duration-[var(--motion-base)] hover:shadow-xl hover:shadow-emerald-950/50 hover:scale-105 active:scale-95"
              >
                Request a pro →
              </Link>
              <Link
                href="/pros"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-700 px-8 py-4 font-semibold text-white transition-all duration-[var(--motion-base)] hover:border-slate-500 hover:bg-slate-900/50"
              >
                Browse professionals
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Live request card */}
      <section className="border-b border-slate-900 py-12">
        <Container>
          {latestRequest ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-950/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-300">Live now</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {latestRequest.category} needed in {latestRequest.suburb}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Just posted, matches being sent</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    {latestRequest.status}
                  </span>
                  <span className="rounded-lg bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">
                    {latestRequest.category}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Stats section */}
      <section className="border-b border-slate-900 py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-6 backdrop-blur-sm transition-all duration-[var(--motion-base)] hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <p className="text-3xl">{kpi.icon}</p>
                <p className="mt-4 text-3xl font-bold text-white">{kpi.value}</p>
                <p className="mt-2 text-sm text-slate-400">{kpi.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works section */}
      <section className="border-b border-slate-900 py-20">
        <Container>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">How FixMzansi works</p>
            <h2 className="mt-3 text-4xl font-bold">Book solar work in 3 steps</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                title: 'Request your work',
                description: 'Tell us what you need. Include photos, location, and urgency.',
              },
              {
                step: 2,
                title: 'Get matched instantly',
                description: 'We match you with top-rated, verified professionals in your area.',
              },
              {
                step: 3,
                title: 'Book & track live',
                description: 'Choose your pro, confirm details, and track progress in real time.',
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-8 backdrop-blur-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300">{item.description}</p>
                </div>
                {idx < 2 ? (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                    <div className="text-3xl text-slate-700">→</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features grid */}
      <section className="border-b border-slate-900 py-20">
        <Container>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">Why choose FixMzansi</p>
            <h2 className="mt-3 text-4xl font-bold">Trusted marketplace features</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-6 backdrop-blur-sm transition-all duration-[var(--motion-base)] hover:border-sky-500/30 hover:bg-sky-500/5"
              >
                <p className="text-4xl">{feature.icon}</p>
                <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured pros section */}
      <section className="border-b border-slate-900 py-20">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Verified network</p>
              <h2 className="mt-3 text-4xl font-bold">Trusted Cape Town solar pros</h2>
              <p className="mt-3 max-w-xl text-slate-300">
                Every professional on our network is verified, insured, and rated by customers who used their services.
              </p>
            </div>
            <Link
              href="/pros"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 font-semibold text-emerald-400 transition-all duration-[var(--motion-base)] hover:text-emerald-300 hover:gap-3"
            >
              View all → 
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredPros.map((pro) => (
              <ProCard key={pro.id} pro={pro} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <Container>
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-950/10 p-12 text-center backdrop-blur">
            <h2 className="text-4xl font-bold">Ready to find your solar professional?</h2>
            <p className="mt-4 text-lg text-slate-300">Join Cape Town homeowners choosing verified pros on FixMzansi.</p>
            <Link
              href="/requests"
              className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-950/30 transition-all duration-[var(--motion-base)] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Request a pro in Cape Town →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
