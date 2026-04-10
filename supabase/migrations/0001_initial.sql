-- Initial schema placeholder for FixMzansi
-- This migration will be expanded in the next iteration.

create table if not exists public.placeholder (
  id bigserial primary key,
  created_at timestamptz not null default now()
);
