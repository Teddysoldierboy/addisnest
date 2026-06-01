-- Run in Supabase SQL editor if columns/tables are missing.

alter table properties
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists amenities jsonb default '[]'::jsonb;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  name text not null,
  phone text not null,
  tour_date date,
  message text,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

create policy "Anyone can submit a lead"
  on leads for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read leads"
  on leads for select
  to authenticated
  using (true);
