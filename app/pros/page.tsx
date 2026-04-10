import { Container } from '@/components/layout/Container';
import { getFeaturedPros } from '@/lib/featured-pros';
import { extractIdentityScopeFromRecord } from '@/lib/identity-scope';
import { ProsDiscoveryClient } from '@/components/pros/ProsDiscoveryClient';

export default async function ProsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const pros = await getFeaturedPros(12);
  const scope = extractIdentityScopeFromRecord((await searchParams) ?? {});

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Verified network</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Cape Town solar pros</h1>
          <p className="mt-3 text-slate-300">
            Search and filter verified installers, electricians, and battery specialists without leaving the directory.
          </p>
        </div>
        <ProsDiscoveryClient pros={pros} scope={scope} />
      </Container>
    </main>
  );
}
