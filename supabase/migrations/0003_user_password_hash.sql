-- App-managed credentials (not Supabase Auth). Used by /api/auth for register + login.

alter table public.users
  add column if not exists password_hash text;

comment on column public.users.password_hash is 'scrypt hash from app (salt:derivedKey hex); null = legacy/demo login only';
