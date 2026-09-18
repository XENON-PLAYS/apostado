create table if not exists public.bot_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  token text not null default '',
  queue_message text not null default 'Entre na fila e aguarde sua vez!',
  mention_players boolean not null default true,
  rich_presence boolean not null default true,
  presence_activity text not null default 'Free Fire',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bot_settings enable row level security;

create policy "Users can read own bot settings"
on public.bot_settings for select
using (auth.uid() = user_id);

create policy "Users can create own bot settings"
on public.bot_settings for insert
with check (auth.uid() = user_id);

create policy "Users can update own bot settings"
on public.bot_settings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
