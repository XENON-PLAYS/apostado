do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bot_settings'
      and column_name = 'presence_activity'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bot_settings'
      and column_name = 'presence_text'
  ) then
    alter table public.bot_settings rename column presence_activity to presence_text;
  end if;
end;
$$;
