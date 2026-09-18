alter table public.profiles
add column if not exists queue_channel_ids text not null default '';

update public.profiles
set bot_token = ''
where bot_token <> '';
