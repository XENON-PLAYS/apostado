create table if not exists public.user_guilds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  guild_id text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, guild_id)
);

alter table public.user_guilds enable row level security;

create policy "Users can read own guilds"
on public.user_guilds for select
using (auth.uid() = user_id);

create policy "Users can create own guilds"
on public.user_guilds for insert
with check (auth.uid() = user_id);

create policy "Users can update own guilds"
on public.user_guilds for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own guilds"
on public.user_guilds for delete
using (auth.uid() = user_id);
