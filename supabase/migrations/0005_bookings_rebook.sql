-- At most one *active* booking per request (pending / confirmed / in_progress).
-- After cancel or complete, the customer can create another booking on the same request.

do $$
declare
  r record;
begin
  for r in
    select c.conname as name
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'bookings'
      and t.relnamespace = (select oid from pg_namespace where nspname = 'public')
      and c.contype = 'u'
      and c.conname ilike '%request%'
  loop
    execute format('alter table public.bookings drop constraint if exists %I', r.name);
  end loop;
end $$;

create unique index if not exists bookings_one_active_per_request_idx
  on public.bookings (request_id)
  where status in ('pending', 'confirmed', 'in_progress');
