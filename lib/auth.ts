import type { AuthRole } from './auth-flow';

export type AuthLoginResult = {
  success: boolean;
  message: string;
  role?: AuthRole;
  email?: string;
  nextPath?: string;
};

export async function signInDemoAccount(role: AuthRole, mode: 'login' | 'register'): Promise<AuthLoginResult> {
  const email = `${role}@fixmzansi.local`;
  const password = 'demo-pass-123';

  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role, mode, email, password, fullName: `${role} demo` }),
  });

  const payload = (await response.json()) as { error?: string; nextPath?: string };

  if (!response.ok) {
    return { success: false, message: payload.error ?? 'Unable to continue', role, email };
  }

  return {
    success: true,
    message: `${role} session ready`,
    role,
    email,
    nextPath: payload.nextPath,
  };
}
