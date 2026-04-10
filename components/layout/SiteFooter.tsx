import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-10 text-sm text-slate-400">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-white">FixMzansi</p>
            <p className="mt-2 max-w-xl">
              Trusted solar installers in Cape Town. We verify providers, support secure booking workflows,
              and keep homeowners informed end to end.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="inline-cta transition hover:text-slate-200">
              Terms
            </Link>
            <Link href="/privacy" className="inline-cta transition hover:text-slate-200">
              Privacy
            </Link>
            <Link href="/support" className="inline-cta transition hover:text-slate-200">
              Support
            </Link>
            <a href="mailto:support@fixmzansi.co.za" className="inline-cta transition hover:text-slate-200">
              support@fixmzansi.co.za
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}