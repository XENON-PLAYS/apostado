alter table public.bot_logs
  add column if not exists created_at timestamptz not null default timezone('utc'::text, now());

alter table public.bot_logs
  alter column action set default 'MESSAGE_SENT',
  alter column details set default '';

notify pgrst, 'reload schema';