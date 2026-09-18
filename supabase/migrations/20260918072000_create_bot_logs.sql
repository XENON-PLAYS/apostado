create table if not exists public.bot_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  details text not null,
  timestamp timestamptz not null default now()
);

alter table public.bot_logs enable row level security;

create policy "Users can read own bot logs"
on public.bot_logs for select
using (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bot_logs'
  ) then
    alter publication supabase_realtime add table public.bot_logs;
  end if;
end;
$$;
