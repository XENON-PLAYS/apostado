create or replace function public.assign_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email = 'admin@adquirabot.app' then
    update public.profiles set role = 'admin' where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists assign_admin_role on auth.users;
create trigger assign_admin_role
after insert on auth.users
for each row execute procedure public.assign_profile_role();
