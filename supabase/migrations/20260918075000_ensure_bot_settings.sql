create table if not exists public.bot_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  token text not null default '',
  queue_channel_ids text not null default '',
  queue_types text not null default '1x1, 2x2, 3x3',
  queue_message text not null default 'Entre na fila e aguarde sua vez!',
  mention_players boolean not null default true,
  reply_dm boolean not null default false,
  rich_presence boolean not null default true,
  presence_text text not null default 'Free Fire',
  guild_id text,
  created_at timestamptz not null default now()
);

alter table public.bot_settings
add column if not exists token text not null default '',
add column if not exists queue_channel_ids text not null default '',
add column if not exists queue_types text not null default '1x1, 2x2, 3x3',
add column if not exists queue_message text not null default 'Entre na fila e aguarde sua vez!',
add column if not exists mention_players boolean not null default true,
add column if not exists reply_dm boolean not null default false,
add column if not exists rich_presence boolean not null default true,
add column if not exists presence_text text not null default 'Free Fire',
add column if not exists guild_id text,
add column if not exists created_at timestamptz not null default now();

alter table public.bot_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bot_settings'
      and policyname = 'Users can read own bot settings'
  ) then
    create policy "Users can read own bot settings"
    on public.bot_settings for select
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bot_settings'
      and policyname = 'Users can create own bot settings'
  ) then
    create policy "Users can create own bot settings"
    on public.bot_settings for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bot_settings'
      and policyname = 'Users can update own bot settings'
  ) then
    create policy "Users can update own bot settings"
    on public.bot_settings for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end;
$$;
