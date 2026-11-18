create table if not exists public.verified_island_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  island_name text not null check (island_name in (
    'Tahiti', 'Moorea', 'Bora Bora', 'Huahine',
    'Raiatea', 'Taha’a', 'Rangiroa', 'Fakarava'
  )),
  verified_at timestamptz not null default now(),
  accuracy_m integer not null check (accuracy_m between 1 and 100),
  distance_to_hub_m integer not null check (distance_to_hub_m between 0 and 800),
  unique (user_id, island_name)
);

alter table public.verified_island_visits enable row level security;

create policy "Users can read their own verified visits"
  on public.verified_island_visits
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Writes are intentionally restricted to the Edge Function using the
-- service role. Never expose the service-role key in the browser.
revoke insert, update, delete on public.verified_island_visits from anon, authenticated;
grant select on public.verified_island_visits to authenticated;
