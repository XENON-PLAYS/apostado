alter table public.profiles
add column if not exists presence_type text not null default 'Jogando',
add column if not exists presence_text text not null default 'Free Fire',
add column if not exists presence_status text not null default 'online'
check (presence_status in ('online', 'idle', 'dnd', 'invisible'));
