alter table public.profiles
add column if not exists token text;

notify pgrst, 'reload schema';