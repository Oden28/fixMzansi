-- FixMzansi marketplace schema
-- Cape Town solar wedge

create extension if not exists pgcrypto;
create extension if not exists postgis;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text unique,
  role text not null default 'consumer' check (role in ('consumer', 'pro', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  trade_category text not null check (trade_category in ('solar', 'electrical', 'battery', 'maintenance')),
  city text not null default 'Cape Town',
  suburb_service_area text[] not null default '{}',
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  rating numeric(2,1) not null default 0,
  response_time_minutes integer not null default 60,
  summary text not null default '',
  profile_photo_url text,
  certificate_files text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null check (category in ('solar', 'electrical', 'battery', 'maintenance')),
  suburb text not null,
  description text not null,
  urgency text not null check (urgency in ('low', 'medium', 'high')),
  photos text[] not null default '{}',
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'matched', 'booked', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  pro_id uuid not null references public.pros(id) on delete cascade,
  rank_score numeric(6,2) not null,
  match_reason text not null default '',
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.service_requests(id) on delete cascade,
  pro_id uuid not null references public.pros(id) on delete cascade,
  scheduled_time timestamptz,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  price_estimate_min numeric(12,2),
  price_estimate_max numeric(12,2),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_pending', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  pro_id uuid not null references public.pros(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  text text not null default '',
  verified boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp', 'sms', 'in_app')),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index if not exists pros_trade_category_idx on public.pros (trade_category);
create index if not exists pros_city_idx on public.pros (city);
create index if not exists service_requests_category_idx on public.service_requests (category);
create index if not exists service_requests_suburb_idx on public.service_requests (suburb);
create index if not exists matches_request_id_idx on public.matches (request_id);
create index if not exists matches_pro_id_idx on public.matches (pro_id);
create index if not exists bookings_request_id_idx on public.bookings (request_id);
create index if not exists bookings_pro_id_idx on public.bookings (pro_id);
