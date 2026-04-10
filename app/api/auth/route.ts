import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import {
  buildAuthNextPath,
  buildAuthScope,
  mapAuthRoleToDbRole,
  requestedRoleMatchesDb,
  type AuthRole,
  type PersistedAuthRole,
} from '@/lib/auth-flow';
import { getProProfilePhotoUrl } from '@/lib/pro-avatar';
import { hashPassword, verifyPassword } from '@/lib/password';
import { signSession, sessionCookieOptions, FM_SESSION_COOKIE } from '@/lib/session-cookie';
import { getDemoAuthPassword } from '@/lib/demo-auth-password';

type AuthPayload = {
  email?: string;
  password?: string;
  role?: AuthRole;
  mode?: 'login' | 'register';
  fullName?: string;
};

type UserRow = {
  id: string;
  email: string | null;
  role: string;
  password_hash: string | null;
};

function validatePayload(payload: AuthPayload): string | null {
  if (!payload.email || !payload.password || !payload.role || !payload.mode) {
    return 'email, password, role, and mode are required';
  }

  if (payload.password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return null;
}

function verifyStoredCredential(account: UserRow, password: string): boolean {
  if (account.password_hash) {
    return verifyPassword(password, account.password_hash);
  }
  return password === getDemoAuthPassword();
}

function attachSessionCookie(res: NextResponse, account: Pick<UserRow, 'id' | 'email' | 'role'>) {
  const role = account.role as 'consumer' | 'pro' | 'admin';
  const token = signSession({ sub: account.id, role, email: account.email });
  res.cookies.set(FM_SESSION_COOKIE, token, sessionCookieOptions());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthPayload;
    const validationError = validatePayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const email = body.email!.trim().toLowerCase();
    const requestedRole = body.role!;
    const mode = body.mode!;
    const fullName = body.fullName?.trim() || `${requestedRole.charAt(0).toUpperCase()}${requestedRole.slice(1)} Demo`;

    const supabase = getSupabaseServerClient();

    if (mode === 'register') {
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
      if (existingUser) {
        return NextResponse.json({ error: 'Account already exists' }, { status: 409 });
      }

      const dbRole = mapAuthRoleToDbRole(requestedRole);
      const credential = hashPassword(body.password!);

      const { data: account, error } = await supabase
        .from('users')
        .insert({
          full_name: fullName,
          email,
          role: dbRole,
          phone: null,
          password_hash: credential,
        })
        .select('id, email, role, password_hash')
        .single();

      if (error || !account) {
        const msg = error?.message ?? '';
        if (msg.includes('password_hash') || msg.includes('column')) {
          return NextResponse.json(
            {
              error:
                'Database is missing password_hash. Apply migration 0003_user_password_hash.sql and retry.',
            },
            { status: 503 },
          );
        }
        throw error ?? new Error('Failed to register account');
      }

      if (requestedRole === 'pro') {
        const { error: proError } = await supabase.from('pros').upsert(
          {
            user_id: account.id,
            trade_category: 'solar',
            city: 'Cape Town',
            suburb_service_area: ['Cape Town'],
            verification_status: 'pending',
            summary: `${fullName} is preparing a trusted FixMzansi pro profile.`,
            profile_photo_url: getProProfilePhotoUrl(fullName),
          },
          { onConflict: 'user_id' },
        );

        if (proError) throw proError;
      }

      const persistedRole = account.role as PersistedAuthRole;
      const scope = buildAuthScope({ id: account.id, role: persistedRole, requestedRole });
      const nextPath = buildAuthNextPath({ id: account.id, role: persistedRole, requestedRole });

      const res = NextResponse.json({
        account: { id: account.id, email: account.email, role: account.role },
        scope,
        nextPath,
        mode: 'register',
      });
      attachSessionCookie(res, account as UserRow);
      return res;
    }

    const { data: account, error: fetchError } = await supabase
      .from('users')
      .select('id, email, role, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!account) {
      return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 });
    }

    const row = account as UserRow;

    if (!verifyStoredCredential(row, body.password!)) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    if (!requestedRoleMatchesDb(requestedRole, row.role)) {
      const hint =
        row.role === 'consumer'
          ? 'customer'
          : row.role === 'pro'
            ? 'pro'
            : row.role === 'admin'
              ? 'admin'
              : row.role;
      return NextResponse.json(
        { error: `This account is registered as a ${hint}. Choose that role above and try again.` },
        { status: 403 },
      );
    }

    const persistedRole = row.role as PersistedAuthRole;
    const scope = buildAuthScope({ id: row.id, role: persistedRole, requestedRole });
    const nextPath = buildAuthNextPath({ id: row.id, role: persistedRole, requestedRole });

    const res = NextResponse.json({
      account: { id: row.id, email: row.email, role: row.role },
      scope,
      nextPath,
      mode: 'login',
    });
    attachSessionCookie(res, row);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
