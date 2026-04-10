import type { Metadata } from 'next';
import './globals.css';
import { Atkinson_Hyperlegible } from 'next/font/google';
import { ChromeClient } from '@/components/layout/ChromeClient';
import { getServerSession } from '@/lib/server-session';

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FixMzansi',
  description: 'Trusted solar installers in Cape Town, instantly discoverable and bookable.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${atkinson.className} bg-slate-950 text-white antialiased`}>
        <ChromeClient initialSession={session}>{children}</ChromeClient>
      </body>
    </html>
  );
}
