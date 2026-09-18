alter table public.profiles
add column if not exists bot_token text not null default '',
add column if not exists queue_types text not null default '1x1, 2x2, 3x3',
add column if not exists queue_message text not null default 'Entre na fila e aguarde sua vez!',
add column if not exists mention_players boolean not null default true,
add column if not exists reply_dm boolean not null default false,
add column if not exists rich_presence boolean not null default true,
add column if not exists bot_status text not null default 'stopped';
