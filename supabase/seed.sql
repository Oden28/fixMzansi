-- Seed data for FixMzansi

insert into public.users (id, full_name, email, phone, role)
values
  ('00000000-0000-0000-0000-000000000001', 'Cape Town Admin', 'admin@fixmzansi.test', '+27000000001', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Solar Customer', 'customer@fixmzansi.test', '+27000000002', 'consumer')
on conflict (id) do nothing;

insert into public.users (id, full_name, email, phone, role)
values
  ('00000000-0000-0000-0000-000000000003', 'SolarWorks Cape', 'solarworks@example.com', '+27000000003', 'pro'),
  ('00000000-0000-0000-0000-000000000004', 'Table Mountain Energy', 'tme@example.com', '+27000000004', 'pro'),
  ('00000000-0000-0000-0000-000000000005', 'Cape Sun Electric', 'capesun@example.com', '+27000000005', 'pro')
on conflict (id) do nothing;

insert into public.pros (user_id, trade_category, city, suburb_service_area, verification_status, rating, response_time_minutes, summary)
values
  ('00000000-0000-0000-0000-000000000003', 'solar', 'Cape Town', array['Claremont', 'Newlands', 'Rondebosch'], 'verified', 4.9, 18, 'Premium solar installer for homes and small businesses.'),
  ('00000000-0000-0000-0000-000000000004', 'solar', 'Cape Town', array['Sea Point', 'Green Point', 'Camps Bay'], 'verified', 4.7, 30, 'Battery backup and inverter specialists.'),
  ('00000000-0000-0000-0000-000000000005', 'solar', 'Cape Town', array['Bellville', 'Durbanville', 'Parow'], 'pending', 4.5, 42, 'Solar installations and electrical support.')
on conflict do nothing;
