import { redirect } from 'next/navigation';
import { getServerSession, type AppSession } from './server-session';

export async function requireCustomerWorkspace(): Promise<AppSession & { role: 'consumer' }> {
  const session = await getServerSession();
  if (!session) redirect(`/login?next=${encodeURIComponent('/dashboard')}`);
  if (session.role === 'pro') redirect('/pro-dashboard');
  if (session.role === 'admin') redirect('/admin');
  return session as AppSession & { role: 'consumer' };
}

export async function requireProWorkspace(): Promise<AppSession & { role: 'pro' }> {
  const session = await getServerSession();
  if (!session) redirect(`/login?next=${encodeURIComponent('/pro-dashboard')}`);
  if (session.role === 'consumer') redirect('/dashboard');
  if (session.role === 'admin') redirect('/admin');
  return session as AppSession & { role: 'pro' };
}

export async function requireAdminWorkspace(): Promise<AppSession & { role: 'admin' }> {
  const session = await getServerSession();
  if (!session) redirect(`/login?next=${encodeURIComponent('/admin')}`);
  if (session.role !== 'admin') {
    if (session.role === 'pro') redirect('/pro-dashboard');
    redirect('/dashboard');
  }
  return session as AppSession & { role: 'admin' };
}

export async function requireSignedIn(): Promise<AppSession> {
  const session = await getServerSession();
  if (!session) redirect(`/login?next=${encodeURIComponent('/notifications')}`);
  return session;
}
