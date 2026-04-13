-- 0004_tighten_schema.sql
-- Adds notifications.updated_at, updated_at triggers, composite indexes, and drops the old placeholder table.
-- (No RLS here — the app uses the Supabase service role on the server.)

-- ── 1. Notifications columns (app + indexes expect these; older DBs may be missing them) ──
alter table public.notifications
  add column if not exists read_at timestamptz;

alter table public.notifications
  add column if not exists updated_at timestamptz not null default now();

-- ── 2. Auto-update updated_at on every write ──
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_users_updated_at') then
    create trigger trg_users_updated_at
      before update on public.users
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_pros_updated_at') then
    create trigger trg_pros_updated_at
      before update on public.pros
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_service_requests_updated_at') then
    create trigger trg_service_requests_updated_at
      before update on public.service_requests
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_bookings_updated_at') then
    create trigger trg_bookings_updated_at
      before update on public.bookings
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_notifications_updated_at') then
    create trigger trg_notifications_updated_at
      before update on public.notifications
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ── 3. Additional composite indexes for common query patterns ──
create index if not exists service_requests_user_status_idx
  on public.service_requests (user_id, status);

create index if not exists service_requests_status_category_idx
  on public.service_requests (status, category);

create index if not exists bookings_status_idx
  on public.bookings (status);

create index if not exists notifications_user_status_idx
  on public.notifications (user_id, status);

-- Unread per user, ordered by recency (read_at is null for all rows in this partial index)
create index if not exists notifications_user_read_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create index if not exists reviews_verified_idx
  on public.reviews (verified)
  where verified = false;

create index if not exists pros_verification_status_idx
  on public.pros (verification_status);

-- ── 4. Drop the placeholder table from 0001 (no longer needed) ──
drop table if exists public.placeholder;
